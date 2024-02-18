/* eslint-disable no-empty */
import { app, BrowserWindow } from 'electron';
import serve from 'electron-serve';
import { autoUpdater } from 'electron-updater';
import path = require('path');

import { existsSync, readFileSync } from 'fs-extra';

import { getAppDirs } from './nativeBridge/modules/common';
import { Logger } from './nativeBridge/modules/common/logger';
import { nativeBridgeRegistry } from './nativeBridge/registry';

if (!app || app.isPackaged) {
  serve({ directory: path.join(__dirname, 'frontend') });
} else {
  app.setName('Terminal One Dev');
}

async function createWindow() {
  const preloadScriptPath = path.join(__dirname, 'preload.bundle.js');

  const windowSize = {
    width: 800,
    height: 600,
  };
  const configDir = getAppDirs().userData;
  const stateFilePath = path.join(configDir, 'window.json');
  if (existsSync(stateFilePath)) {
    const stateFromFile = JSON.parse(
      readFileSync(stateFilePath, { encoding: 'utf8' }),
    );
    windowSize.width = stateFromFile.w ?? windowSize.width;
    windowSize.height = stateFromFile.h ?? windowSize.height;
  }

  const win = new BrowserWindow({
    title: 'Terminal One',
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, 'public', 'icon.png'),
    backgroundColor: '#000000',
    visualEffectState: 'followWindow',
    transparent: true,
    width: windowSize.width,
    height: windowSize.height,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: preloadScriptPath,
    },
  });

  win.setMinimumSize(400, 300);
  win.setMenuBarVisibility(false);

  win.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  win.webContents.on('did-frame-finish-load', () => {
    if (!app.isPackaged && win) {
      // DevTools
      win.webContents.openDevTools({ mode: 'detach' });
    }
  });

  nativeBridgeRegistry.startListeners(win);

  if (!app || app.isPackaged) {
    await win.loadURL('app://-');
  } else {
    await win.loadURL(`http://localhost:3000`);
  }

  Logger.getInstance().log('info', 'app started');
}

app.on('ready', async () => {
  await createWindow();

  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

app.on('window-all-closed', () => {
  app.quit();
});
