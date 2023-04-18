import { BrowserWindow, shell } from 'electron';

import { moduleFunction, NativeBridgeModule, nativeBridgeModule } from '../module';

@nativeBridgeModule('links')
export class ExternalLinksModule extends NativeBridgeModule {
  @moduleFunction()
  public async openExternalURL(_mainWindow: BrowserWindow, url: string) {
    // Security ref: https://benjamin-altpeter.de/shell-openexternal-dangers/
    if (typeof url !== 'string') throw new Error('openExternalURL limited to strings');
    if (!url.startsWith('https://')) throw new Error('openExternalURL limited to https protocol');
    return shell.openExternal(url);
  }
}
