import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('$t1', {
  platform: process.platform,
});
