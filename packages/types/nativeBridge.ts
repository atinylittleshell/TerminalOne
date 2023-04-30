import { ResolvedConfig } from './config';
import { LogLevel } from './logger';

type ElectronOpaqueEvent = {
  senderId: number;
};

export type INativeBridge = {
  platform:
    | 'aix'
    | 'android'
    | 'darwin'
    | 'freebsd'
    | 'haiku'
    | 'linux'
    | 'openbsd'
    | 'sunos'
    | 'win32'
    | 'cygwin'
    | 'netbsd';
  win: {
    onWindowResized: (_callback: (_event: ElectronOpaqueEvent, _w: number, _h: number) => void) => void;
    onWindowMoved: (_callback: (_event: ElectronOpaqueEvent, _x: number, _y: number) => void) => void;
    setWindowSize: (_width: number, _height: number) => Promise<void>;
    setWindowPosition: (_x: number, _y: number) => Promise<void>;
    getWindowPosition: () => Promise<[number, number]>;
    getWindowSize: () => Promise<[number, number]>;
    minimize: () => Promise<void>;
    maximize: (_maximize?: boolean) => Promise<void>;
    isMinimized: () => Promise<boolean>;
    isMaximized: () => Promise<boolean>;
  };
  app: {
    quit: () => Promise<void>;
    setOpenAtLogin: (_openAtLogin: boolean) => Promise<void>;
    getIsPackaged: () => Promise<boolean>;
    getVersion: () => Promise<string>;
    clearStorage: () => Promise<void>;
    getLogPath: () => Promise<string>;
    log: (_level: LogLevel, _message: string) => Promise<void>;
    onLog: (_callback: (_event: ElectronOpaqueEvent, _level: LogLevel, _message: string) => void) => void;
  };
  links: {
    openExternalURL: (_url: string) => Promise<void>;
    openFile: (_path: string) => Promise<void>;
  };
  terminal: {
    newTerminal: (
      _id: string,
      _cols: number,
      _rows: number,
      _shellCommand: string,
      _startupDirectory: string,
    ) => Promise<void>;
    resizeTerminal: (_id: string, _cols: number, _rows: number) => Promise<void>;
    killTerminal: (_id: string) => Promise<void>;
    writeTerminal: (_id: string, _data: string) => Promise<void>;
    onData: (_callback: (_event: ElectronOpaqueEvent, _id: string, _data: string) => void) => void;
  };
  config: {
    getConfig: () => Promise<ResolvedConfig>;
    getConfigPath: () => Promise<string>;
  };
};
