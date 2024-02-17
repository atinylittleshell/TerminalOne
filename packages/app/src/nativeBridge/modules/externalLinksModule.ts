import { BrowserWindow, shell } from 'electron';
import { existsSync } from 'fs-extra';

import {
  moduleFunction,
  NativeBridgeModule,
  nativeBridgeModule,
} from '../module';

@nativeBridgeModule('links')
export class ExternalLinksModule extends NativeBridgeModule {
  @moduleFunction()
  public async openExternalURL(_mainWindow: BrowserWindow, url: string) {
    // Security ref: https://benjamin-altpeter.de/shell-openexternal-dangers/
    if (typeof url !== 'string')
      throw new Error('openExternalURL limited to strings');
    if (!url.startsWith('http://') && !url.startsWith('https://'))
      throw new Error('openExternalURL limited to http and https protocol');
    return shell.openExternal(url);
  }

  @moduleFunction()
  public async openFile(_mainWindow: BrowserWindow, path: string) {
    if (!existsSync(path)) {
      throw new Error('File does not exist');
    }

    return shell.openPath(path);
  }
}
