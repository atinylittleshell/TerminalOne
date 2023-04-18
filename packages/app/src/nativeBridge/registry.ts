/* eslint-disable @typescript-eslint/ban-types */
import { BrowserWindow, ipcMain, ipcRenderer, IpcRendererEvent } from 'electron';

import { getModuleEventKey, getModuleFunctionKey, MODULE_METADATA, NativeBridgeModule } from './module';
import { ApplicationModule } from './modules/applicationModule';
import { BnetModule } from './modules/bnetModule';
import { ExternalLinksModule } from './modules/externalLinksModule';
import { FilesModule } from './modules/filesModule';
import { LogsModule } from './modules/logsModule';
import { MainWindowModule } from './modules/mainWindowModule';

export class NativeBridgeRegistry {
  private modules: NativeBridgeModule[] = [];

  public registerModule<T extends NativeBridgeModule>(moduleClass: new () => T): void {
    const module = new moduleClass();
    this.modules.push(module);
  }

  public generateAPIObject(): Object {
    return Object.assign(
      {},
      ...this.modules.map((module) => {
        const ctor = Object.getPrototypeOf(module).constructor;
        const moduleMetadata = MODULE_METADATA.get(ctor);
        if (!moduleMetadata) {
          throw new Error('module metadata not found');
        }

        const moduleApi: Record<string, Object> = {};

        Object.values(moduleMetadata.functions).forEach((func) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          moduleApi[func.name] = (...args: any[]) => {
            return ipcRenderer.invoke(getModuleFunctionKey(moduleMetadata.name, func.name), ...args);
          };
        });

        Object.values(moduleMetadata.events).forEach((evt) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          moduleApi[evt.name] = (callback: (event: IpcRendererEvent, ...args: any[]) => void) =>
            evt.type === 'on'
              ? ipcRenderer.on(getModuleEventKey(moduleMetadata.name, evt.name), callback)
              : ipcRenderer.once(getModuleEventKey(moduleMetadata.name, evt.name), callback);

          moduleApi[`removeAll_${evt.name}_listeners`] = () =>
            ipcRenderer.removeAllListeners(getModuleEventKey(moduleMetadata.name, evt.name));
        });

        return {
          [moduleMetadata.name]: moduleApi,
        };
      }),
    );
  }

  public startListeners(mainWindow: BrowserWindow): void {
    this.modules.forEach((module) => {
      const ctor = Object.getPrototypeOf(module).constructor;
      const moduleMetadata = MODULE_METADATA.get(ctor);
      if (!moduleMetadata) {
        throw new Error('module metadata not found');
      }

      Object.values(moduleMetadata.functions).forEach((func) => {
        ipcMain.handle(getModuleFunctionKey(moduleMetadata.name, func.name), async (_event, ...args) => {
          return func.value.bind(module)(mainWindow, ...args);
        });
      });

      module.onRegistered(mainWindow);
    });
  }
}

export const nativeBridgeRegistry = new NativeBridgeRegistry();

nativeBridgeRegistry.registerModule(LogsModule);
nativeBridgeRegistry.registerModule(BnetModule);
nativeBridgeRegistry.registerModule(FilesModule);
nativeBridgeRegistry.registerModule(ExternalLinksModule);
nativeBridgeRegistry.registerModule(MainWindowModule);
nativeBridgeRegistry.registerModule(ApplicationModule);
