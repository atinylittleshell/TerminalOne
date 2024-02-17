/* eslint-disable @typescript-eslint/ban-types */
import { BrowserWindow } from 'electron';

type ModuleFunction = {
  name: string;
  value: (_mainWindow: BrowserWindow, ..._args: unknown[]) => Promise<unknown>;
};

type ModuleEventType = 'on' | 'once';

type ModuleEvent = {
  name: string;
  type: ModuleEventType;
};

type NativeBridgeModuleMetadata = {
  name: string;
  constructor: Function;
  functions: Record<string, ModuleFunction>;
  events: Record<string, ModuleEvent>;
};

export const MODULE_METADATA: Map<Function, NativeBridgeModuleMetadata> =
  new Map<Function, NativeBridgeModuleMetadata>();

function ensureModuleMetadata(ctor: Function): NativeBridgeModuleMetadata {
  if (!MODULE_METADATA.has(ctor)) {
    MODULE_METADATA.set(ctor, {
      name: ctor.name,
      constructor: ctor,
      functions: {},
      events: {},
    });
  }

  const result = MODULE_METADATA.get(ctor);
  if (result) {
    return result;
  }
  throw new Error('Failed to ensure module metadata');
}

export function nativeBridgeModule(name: string) {
  return function (ctor: new () => NativeBridgeModule) {
    const mod = ensureModuleMetadata(ctor);
    mod.name = name;
  };
}

export function getModuleKey(moduleName: string): string {
  return `TerminalOne:${moduleName}`;
}

export function getModuleFunctionKey(
  moduleName: string,
  functionName: string,
): string {
  return `${getModuleKey(moduleName)}:${functionName}`;
}

export function getModuleEventKey(
  moduleName: string,
  eventName: string,
): string {
  return `${getModuleKey(moduleName)}:${eventName}`;
}

export function moduleFunction(nameOverride?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    if (!target.constructor) {
      throw new Error('@moduleFunction must be used within a class');
    }

    const mod = ensureModuleMetadata(target.constructor);
    mod.functions[key] = {
      name: nameOverride || key,
      value: descriptor.value,
    };
  };
}

export function moduleEvent(type: ModuleEventType, nameOverride?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    if (!target.constructor) {
      throw new Error('@moduleEvent must be used within a class');
    }

    const mod = ensureModuleMetadata(target.constructor);
    mod.events[key] = {
      type,
      name: nameOverride || key,
    };

    descriptor.value = (mainWindow: BrowserWindow, ...args: unknown[]) => {
      const eventKey = `${getModuleKey(mod.name)}:${key}`;
      mainWindow.webContents.send(eventKey, ...args);
    };
  };
}

export abstract class NativeBridgeModule {
  /**
   * Callback after module is registered in case any bespoke action is needed.
   * Useful for mapping events on the mainWindow into module domain events.
   * @param _mainWindow BrowserWindow
   */
  public onRegistered(_mainWindow: BrowserWindow): void {
    return;
  }
}
