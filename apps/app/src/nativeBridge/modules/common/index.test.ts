import path from 'path';

import { getAppDirs } from '.';

jest.mock('appdirsjs', () => {
  return {
    __esModule: true,
    default: (config: any) => {
      return {
        config: path.join(config.appName, 'config'),
        data: path.join(config.appName, 'data'),
      };
    },
  };
});

jest.mock('electron', () => {
  return {
    __esModule: true,
    app: {
      isPackaged: false,
    },
  };
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getAppDirs', () => {
  it('should return the correct config directory', () => {
    const dirs = getAppDirs();
    expect(dirs.config).toBe(path.join('TerminalOneDev', 'config'));
  });

  it('should return the correct data directory', () => {
    const dirs = getAppDirs();
    expect(dirs.data).toBe(path.join('TerminalOneDev', 'data'));
  });
});
