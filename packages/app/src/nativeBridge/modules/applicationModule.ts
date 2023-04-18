import { app, BrowserWindow, session } from 'electron';

import { moduleFunction, NativeBridgeModule, nativeBridgeModule } from '../module';

@nativeBridgeModule('app')
export class ApplicationModule extends NativeBridgeModule {
  @moduleFunction()
  public async quit(_mainWindow: BrowserWindow): Promise<void> {
    app.quit();
  }

  @moduleFunction()
  public async setOpenAtLogin(_mainWindow: BrowserWindow, openAtLogin: boolean): Promise<void> {
    if (!app.isPackaged) {
      // do not make the dev app launch on startup
      return;
    }
    return app.setLoginItemSettings({
      openAtLogin,
    });
  }

  @moduleFunction()
  public async getIsPackaged(_mainWindow: BrowserWindow) {
    return app.isPackaged;
  }

  @moduleFunction()
  public async getVersion(_mainWindow: BrowserWindow) {
    return app.getVersion();
  }

  @moduleFunction()
  public async clearStorage(_mainWindow: BrowserWindow) {
    await session.defaultSession.clearStorageData();
  }
}
