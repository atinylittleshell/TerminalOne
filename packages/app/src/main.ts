import { app, BrowserWindow } from 'electron';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';

import path = require('path');

function createWindow() {
  const preloadScriptPath = path.join(__dirname, 'preload.bundle.js');

  const win = new BrowserWindow({
    frame: false,
    backgroundColor: '#000000',
    width: 800,
    height: 640,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: preloadScriptPath,
    },
  });

  win.setMenuBarVisibility(false);

  if (!app.isPackaged) {
    win.loadURL('http://localhost:3000/');
  } else {
    // win.loadURL(`https://desktop.wowarenalogs.com/?time=${moment.now()}`, {
    //   extraHeaders: 'pragma: no-cache\n',
    // });
    throw new Error('Not implemented');
  }

  win.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  win.webContents.on('did-frame-finish-load', () => {
    // DevTools
    installExtension(REACT_DEVELOPER_TOOLS);

    if (!app.isPackaged && win) {
      win.webContents.openDevTools({ mode: 'detach' });
    }
  });
}

if (app.isPackaged) {
  require('update-electron-app')({
    repo: 'kunchenguid/TerminalOne',
    notifyUser: false,
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit();
});
