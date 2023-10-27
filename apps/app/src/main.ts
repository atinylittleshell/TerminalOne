/* eslint-disable no-empty */
import { app, BrowserWindow } from 'electron';
import serve from 'electron-serve';
import { autoUpdater } from 'electron-updater';
import path = require('path');

import { Logger } from './nativeBridge/modules/common/logger';
import { nativeBridgeRegistry } from './nativeBridge/registry';

if (!app || app.isPackaged) {
  serve({ directory: path.join(__dirname, 'terminal') });
} else {
  app.setName('Terminal One Dev');
}

async function createWindow() {
  const preloadScriptPath = path.join(__dirname, 'preload.bundle.js');

  const win = new BrowserWindow({
    title: 'Terminal One',
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, 'public', 'icon.png'),
    backgroundColor: '#000000',
    width: 800,
    height: 600,
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
