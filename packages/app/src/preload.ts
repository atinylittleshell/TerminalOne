import { contextBridge } from 'electron';

import { nativeBridgeRegistry } from './nativeBridge/registry';

contextBridge.exposeInMainWorld('TerminalOne', {
  ...nativeBridgeRegistry.generateAPIObject(),
  platform: process.platform,
});
