import { BrowserWindow } from 'electron';
import { existsSync, mkdirSync, readFileSync, writeFile } from 'fs-extra';
import path from 'path';

import {
  moduleEvent,
  moduleFunction,
  NativeBridgeModule,
  nativeBridgeModule,
} from '../module';
import { getAppDirs } from './common';

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
  public async maximize(
    mainWindow: BrowserWindow,
    maximize?: boolean,
  ): Promise<void> {
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
  public async setWindowSize(
    mainWindow: BrowserWindow,
    width: number,
    height: number,
  ) {
    mainWindow.setSize(width, height);
  }

  @moduleFunction()
  public async setWindowPosition(
    mainWindow: BrowserWindow,
    x: number,
    y: number,
  ) {
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
    const [w, h] = mainWindow.getSize();
    const [x, y] = mainWindow.getPosition();

    let latestState = {
      x,
      y,
      w,
      h,
    };
    let savedState = {
      ...latestState,
    };

    const configDir = getAppDirs().userData;
    const stateFilePath = path.join(configDir, 'window.json');
    if (existsSync(stateFilePath)) {
      const stateFromFile = JSON.parse(
        readFileSync(stateFilePath, { encoding: 'utf8' }),
      );
      latestState = {
        x: stateFromFile.x ?? x,
        y: stateFromFile.y ?? y,
        w: stateFromFile.w ?? w,
        h: stateFromFile.h ?? h,
      };

      mainWindow.setSize(latestState.w, latestState.h);
      mainWindow.setPosition(latestState.x, latestState.y);

      savedState = {
        ...latestState,
      };
    } else {
      mkdirSync(configDir, { recursive: true });
    }

    mainWindow.on('resize', () => {
      const [w, h] = mainWindow.getSize();
      latestState = { ...latestState, w, h };
      this.onWindowResized(mainWindow, w, h);
    });
    mainWindow.on('move', () => {
      const [x, y] = mainWindow.getPosition();
      latestState = { ...latestState, x, y };
      this.onWindowMoved(mainWindow, x, y);
    });

    setInterval(() => {
      if (
        latestState.x !== savedState.x ||
        latestState.y !== savedState.y ||
        latestState.w !== savedState.w ||
        latestState.h !== savedState.h
      ) {
        writeFile(stateFilePath, JSON.stringify(latestState)).then(() => {
          savedState = {
            ...latestState,
          };
        });
      }
    }, 1000);
  }

  @moduleEvent('on')
  public onWindowResized(
    _mainWindow: BrowserWindow,
    _w: number,
    _h: number,
  ): void {
    return;
  }

  @moduleEvent('on')
  public onWindowMoved(
    _mainWindow: BrowserWindow,
    _x: number,
    _y: number,
  ): void {
    return;
  }
}
