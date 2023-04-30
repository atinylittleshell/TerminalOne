import appDirs from 'appdirsjs';

export const getAppDirs = () => {
  return appDirs({ appName: 'TerminalOne' });
};
