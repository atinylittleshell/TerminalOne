import {
  BrowserWindow,
  ipcMain,
  ipcRenderer,
  IpcRendererEvent,
} from 'electron';

import {
  getModuleEventKey,
  getModuleFunctionKey,
  MODULE_METADATA,
  NativeBridgeModule,
} from './module';
import { ApplicationModule } from './modules/applicationModule';
import { ConfigModule } from './modules/configModule';
import { ExternalLinksModule } from './modules/externalLinksModule';
import { MainWindowModule } from './modules/mainWindowModule';
import { TerminalModule } from './modules/terminalModule';

export class NativeBridgeRegistry {
  private modules: NativeBridgeModule[] = [];

  public registerModule<T extends NativeBridgeModule>(
    moduleClass: new () => T,
  ): void {
    const mod = new moduleClass();
    this.modules.push(mod);
  }

  public generateAPIObject(): Record<string, unknown> {
    return Object.assign(
      {},
      ...this.modules.map((module) => {
        const ctor = Object.getPrototypeOf(module).constructor;
        const moduleMetadata = MODULE_METADATA.get(ctor);
        if (!moduleMetadata) {
          throw new Error('module metadata not found');
        }

        const moduleApi: Record<string, unknown> = {};

        Object.values(moduleMetadata.functions).forEach((func) => {
          moduleApi[func.name] = (...args: unknown[]) => {
            return ipcRenderer.invoke(
              getModuleFunctionKey(moduleMetadata.name, func.name),
              ...args,
            );
          };
        });

        Object.values(moduleMetadata.events).forEach((evt) => {
          moduleApi[evt.name] = (
            callback: (_event: IpcRendererEvent, ..._args: unknown[]) => void,
          ) =>
            evt.type === 'on'
              ? ipcRenderer.on(
                  getModuleEventKey(moduleMetadata.name, evt.name),
                  callback,
                )
              : ipcRenderer.once(
                  getModuleEventKey(moduleMetadata.name, evt.name),
                  callback,
                );

          moduleApi[`removeAll_${evt.name}_listeners`] = () =>
            ipcRenderer.removeAllListeners(
              getModuleEventKey(moduleMetadata.name, evt.name),
            );
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
        ipcMain.handle(
          getModuleFunctionKey(moduleMetadata.name, func.name),
          async (_event, ...args) => {
            return func.value.bind(module)(mainWindow, ...args);
          },
        );
      });

      module.onRegistered(mainWindow);
    });
  }
}

export const nativeBridgeRegistry = new NativeBridgeRegistry();

nativeBridgeRegistry.registerModule(ExternalLinksModule);
nativeBridgeRegistry.registerModule(MainWindowModule);
nativeBridgeRegistry.registerModule(ApplicationModule);
nativeBridgeRegistry.registerModule(TerminalModule);
nativeBridgeRegistry.registerModule(ConfigModule);
