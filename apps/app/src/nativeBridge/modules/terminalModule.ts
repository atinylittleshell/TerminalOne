import { app, BrowserWindow } from 'electron';
import { IPty } from 'node-pty';
import os from 'os';
import { osLocaleSync } from 'os-locale';

import {
  moduleEvent,
  moduleFunction,
  NativeBridgeModule,
  nativeBridgeModule,
} from '../module';
import { Logger } from './common/logger';

class PTYInstance {
  private ptyProcess: IPty;

  public readonly id: string;

  constructor(
    id: string,
    cols: number,
    rows: number,
    shellCommand: string,
    startupDirectory: string,
  ) {
    this.id = id;

    const shell =
      shellCommand ||
      process.env[process.platform === 'win32' ? 'COMSPEC' : 'SHELL'] ||
      (process.platform === 'win32' ? 'cmd.exe' : '/bin/bash');

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    this.ptyProcess = require('node-pty').spawn(shell, [], {
      name: 'xterm-256color',
      cols: cols,
      rows: rows,
      cwd: startupDirectory || os.homedir() || process.cwd(),
      env: {
        ...process.env,
        LANG: `${osLocaleSync().replace(/-/, '_')}.UTF-8`,
        TERM: 'xterm-256color',
        COLORTERM: 'truecolor',
        TERM_PROGRAM: app.name,
        TERM_PROGRAM_VERSION: app.getVersion(),
      },
    });

    Logger.getInstance().log(
      'info',
      `Created new terminal with id: ${id}, size: ${cols}x${rows}, shell: ${shell}`,
    );
  }

  public resize(cols: number, rows: number): void {
    this.ptyProcess.resize(cols, rows);

    Logger.getInstance().log('info', `Resized terminal to ${cols}x${rows}`);
  }

  public kill(): void {
    this.ptyProcess.kill();
    Logger.getInstance().log('info', `Killed terminal with id: ${this.id}`);
  }

  public write(data: string): void {
    this.ptyProcess.write(data);
  }

  public onData(handler: (_: string) => void): void {
    this.ptyProcess.onData(handler);
  }

  public onExit(handler: () => void): void {
    this.ptyProcess.onExit(handler);
  }
}

@nativeBridgeModule('terminal')
export class TerminalModule extends NativeBridgeModule {
  private ptyInstances: { [id: string]: PTYInstance } = {};

  @moduleFunction()
  public async createTerminalIfNotExist(
    mainWindow: BrowserWindow,
    id: string,
    cols: number,
    rows: number,
    shellCommand: string,
    startupDirectory: string,
  ): Promise<void> {
    if (this.ptyInstances[id]) {
      return;
    }

    const ptyInstance = new PTYInstance(
      id,
      cols,
      rows,
      shellCommand,
      startupDirectory,
    );
    ptyInstance.onData((data: string) => {
      this.onData(mainWindow, ptyInstance.id, data);
    });
    ptyInstance.onExit(() => {
      this.onExit(mainWindow, ptyInstance.id);
    });

    this.ptyInstances[ptyInstance.id] = ptyInstance;
  }

  @moduleFunction()
  public async resizeTerminal(
    _mainWindow: BrowserWindow,
    id: string,
    cols: number,
    rows: number,
  ): Promise<void> {
    const ptyInstance = this.ptyInstances[id];
    if (ptyInstance) {
      ptyInstance.resize(cols, rows);
    }
  }

  @moduleFunction()
  public async killTerminal(
    _mainWindow: BrowserWindow,
    id: string,
  ): Promise<void> {
    const ptyInstance = this.ptyInstances[id];
    if (ptyInstance) {
      ptyInstance.kill();
      delete this.ptyInstances[id];
    } else {
      Logger.getInstance().log(
        'warn',
        `Could not find terminal with id: ${id}`,
      );
    }
  }

  @moduleFunction()
  public async writeTerminal(
    _mainWindow: BrowserWindow,
    id: string,
    data: string,
  ): Promise<void> {
    const ptyInstance = this.ptyInstances[id];
    if (ptyInstance) {
      ptyInstance.write(data);
    }
  }

  @moduleEvent('on')
  public onData(_mainWindow: BrowserWindow, _id: string, _data: string): void {
    return;
  }

  @moduleEvent('on')
  public onExit(_mainWindow: BrowserWindow, _id: string): void {
    return;
  }
}
