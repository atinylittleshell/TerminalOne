import { app, BrowserWindow } from 'electron';
import { autoUpdater } from 'electron-updater';

import { nativeBridgeRegistry } from './nativeBridge/registry';

import path = require('path');

function createWindow() {
  const preloadScriptPath = path.join(__dirname, 'preload.bundle.js');

  const win = new BrowserWindow({
    frame: false,
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

  if (!app || app.isPackaged) {
    win.loadURL(`file://${__dirname}/terminal/index.html`);
  } else {
    win.loadURL(`http://localhost:3000`);
  }

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
}

app.on('ready', () => {
  createWindow();

  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

app.on('window-all-closed', () => {
  app.quit();
});
