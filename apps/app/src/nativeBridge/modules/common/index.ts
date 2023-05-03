import appDirs from 'appdirsjs';
import { app } from 'electron';

export const getAppDirs = () => {
  return appDirs({ appName: app.isPackaged ? 'TerminalOne' : 'TerminalOneDev' });
};
