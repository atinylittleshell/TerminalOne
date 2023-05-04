import path from 'path';

import { getAppDirs } from '.';

jest.mock('electron', () => {
  return {
    __esModule: true,
    app: {
      isPackaged: false,
      getPath: (pathName: string) => {
        return path.join('TerminalOneDev', pathName);
      },
    },
  };
});

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getAppDirs', () => {
  it('should return the correct userData directory', () => {
    const dirs = getAppDirs();
    expect(dirs.userData).toBe(path.join('TerminalOneDev', 'userData'));
  });
});
