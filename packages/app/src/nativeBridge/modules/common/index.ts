import { app } from 'electron';

export const getAppDirs = () => {
  return {
    userData: app.getPath('userData'),
    home: app.getPath('home'),
  };
};
