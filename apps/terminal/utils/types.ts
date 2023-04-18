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
  win?: {
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
    hideToSystemTray?: () => Promise<void>;
  };
  app?: {
    quit: () => Promise<void>;
    setOpenAtLogin: (_openAtLogin: boolean) => Promise<void>;
    getIsPackaged: () => Promise<boolean>;
    getVersion?: () => Promise<string>;
    clearStorage?: () => Promise<void>;
  };
  links?: {
    openExternalURL: (_url: string) => Promise<void>;
  };
};
