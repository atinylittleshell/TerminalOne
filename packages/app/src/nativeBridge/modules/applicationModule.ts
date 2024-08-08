import { LogLevel } from '@terminalone/types';
import { app, BrowserWindow, session } from 'electron';

import {
  moduleEvent,
  moduleFunction,
  NativeBridgeModule,
  nativeBridgeModule,
} from '../module';
import { Logger } from './common/logger';

@nativeBridgeModule('app')
export class ApplicationModule extends NativeBridgeModule {
  @moduleFunction()
  public async quit(_mainWindow: BrowserWindow): Promise<void> {
    app.quit();
  }

  @moduleFunction()
  public async setOpenAtLogin(
    _mainWindow: BrowserWindow,
    openAtLogin: boolean,
  ): Promise<void> {
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

  @moduleFunction()
  public async log(
    _mainWindow: BrowserWindow,
    level: LogLevel,
    message: string,
  ): Promise<void> {
    Logger.getInstance().log(level, message);
  }

  @moduleFunction()
  public async getLogPath(_mainWindow: BrowserWindow): Promise<string> {
    return Logger.getInstance().getLogPath();
  }

  @moduleFunction()
  public async renameTab(
    _mainWindow: BrowserWindow,
    tabId: number,
    newTabName: string,
  ): Promise<void> {
    // Implement the logic to rename the tab
  }

  @moduleEvent('on')
  public onLog(
    _mainWindow: BrowserWindow,
    _level: LogLevel,
    _message: string,
  ): void {
    return;
  }

  public onRegistered(mainWindow: BrowserWindow): void {
    Logger.getInstance().on('logged', (level, message) => {
      this.onLog(mainWindow, level, message);
    });
  }
}
