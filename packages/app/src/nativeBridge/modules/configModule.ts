import {
  DEFAULT_CONFIG,
  resolveConfig,
  ResolvedConfig,
} from '@terminalone/types';
import { app, BrowserWindow } from 'electron';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs-extra';
import os from 'os';
import path from 'path';
import vm from 'vm';

import {
  moduleFunction,
  NativeBridgeModule,
  nativeBridgeModule,
} from '../module';
import { getAppDirs } from './common';
import { Logger } from './common/logger';

@nativeBridgeModule('config')
export class ConfigModule extends NativeBridgeModule {
  private configPath: string = '';
  private config: ResolvedConfig = DEFAULT_CONFIG;
  private tabNames: Record<number, string> = {};

  @moduleFunction()
  public async getConfig(_mainWindow: BrowserWindow): Promise<ResolvedConfig> {
    return this.config;
  }

  @moduleFunction()
  public async getConfigPath(_mainWindow: BrowserWindow): Promise<string> {
    return this.configPath;
  }

  @moduleFunction()
  public async renameTab(
    _mainWindow: BrowserWindow,
    tabId: number,
    newTabName: string,
  ): Promise<void> {
    this.tabNames[tabId] = newTabName;
  }

  public onRegistered(mainWindow: BrowserWindow): void {
    const configPathCandidates: string[] = [
      path.join(
        getAppDirs().home,
        '.config',
        app.getName().replace(/\s/g, ''),
        'config.js',
      ),
      path.join(getAppDirs().userData, 'config.js'),
    ];

    // look for the first existing config file. if not found, use the first candidate
    this.configPath = configPathCandidates[0];
    for (const configPathCandidate of configPathCandidates) {
      if (existsSync(configPathCandidate)) {
        this.configPath = configPathCandidate;
        break;
      }
    }

    if (!existsSync(this.configPath)) {
      const configDir = path.dirname(this.configPath);
      mkdirSync(configDir, { recursive: true });
      writeFileSync(
        this.configPath,
        '// see https://github.com/atinylittleshell/TerminalOne/blob/main/packages/types/defaultConfig.ts for supported configuration values\n' +
          'module.exports = {};',
      );
    }

    const configContent = readFileSync(this.configPath, 'utf8');

    try {
      const script = new vm.Script(configContent, {
        filename: 'config.js',
        displayErrors: true,
      });
      const mod: Record<string, unknown> = {};
      script.runInNewContext({
        module: mod,
        require: (moduleName: string) => {
          if (moduleName === 'os') {
            return os;
          }
          return undefined;
        },
      });
      if (!mod.exports) {
        throw new Error('Invalid config: `module.exports` not set');
      }

      Logger.getInstance().log(
        'info',
        `Loaded config from ${this.configPath}}: ${JSON.stringify(
          mod.exports,
        )}`,
      );

      const resolved = resolveConfig(mod.exports, os.platform(), os.release());
      this.config = resolved;

      this.applyConfig(resolved, mainWindow);
    } catch (err: unknown) {
      const e = err as Error;
      Logger.getInstance().log(
        'error',
        JSON.stringify(
          {
            name: e.name,
            message: e.message,
            stack: e.stack,
          },
          null,
          2,
        ),
      );
    }
  }

  private applyConfig(config: ResolvedConfig, mainWindow: BrowserWindow): void {
    if (config.acrylic) {
      if (os.platform() === 'darwin') {
        mainWindow.setVibrancy('under-window');
      } else {
        mainWindow.setBackgroundMaterial('acrylic');
      }
      mainWindow.setBackgroundColor('#00000000');
    }
  }
}
