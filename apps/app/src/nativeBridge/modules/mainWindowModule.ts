import { BrowserWindow } from 'electron';

import { moduleEvent, moduleFunction, NativeBridgeModule, nativeBridgeModule } from '../module';

@nativeBridgeModule('win')
export class MainWindowModule extends NativeBridgeModule {
  @moduleFunction()
  public async isMaximized(mainWindow: BrowserWindow): Promise<boolean> {
    return mainWindow.isMaximized();
  }

  @moduleFunction()
  public async isMinimized(mainWindow: BrowserWindow): Promise<boolean> {
    return mainWindow.isMinimized();
  }

  @moduleFunction()
  public async minimize(mainWindow: BrowserWindow): Promise<void> {
    mainWindow.minimize();
  }

  @moduleFunction()
  public async maximize(mainWindow: BrowserWindow, maximize?: boolean): Promise<void> {
    if (maximize === undefined) {
      maximize = true;
    }

    if (maximize) {
      mainWindow.maximize();
    } else {
      mainWindow.unmaximize();
    }
  }

  @moduleFunction()
  public async hideToSystemTray(mainWindow: BrowserWindow): Promise<void> {
    mainWindow.hide();
  }

  @moduleFunction()
  public async setWindowSize(mainWindow: BrowserWindow, width: number, height: number) {
    mainWindow.setSize(width, height);
  }

  @moduleFunction()
  public async setWindowPosition(mainWindow: BrowserWindow, x: number, y: number) {
    mainWindow.setPosition(x, y);
  }

  @moduleFunction()
  public async getWindowPosition(mainWindow: BrowserWindow) {
    return mainWindow.getPosition();
  }

  @moduleFunction()
  public async getWindowSize(mainWindow: BrowserWindow) {
    return mainWindow.getSize();
  }

  public onRegistered(mainWindow: BrowserWindow): void {
    mainWindow.on('resize', () => {
      const [w, h] = mainWindow.getSize();
      this.onWindowResized(mainWindow, w, h);
    });
    mainWindow.on('move', () => {
      const [x, y] = mainWindow.getPosition();
      this.onWindowMoved(mainWindow, x, y);
    });
  }

  @moduleEvent('on')
  public onWindowResized(_mainWindow: BrowserWindow, _w: number, _h: number): void {
    return;
  }

  @moduleEvent('on')
  public onWindowMoved(_mainWindow: BrowserWindow, _x: number, _y: number): void {
    return;
  }
}
