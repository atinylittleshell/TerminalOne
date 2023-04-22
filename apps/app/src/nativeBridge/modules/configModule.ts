import { Config, DEFAULT_CONFIG } from '@terminalone/types';
import appDirs from 'appdirsjs';
import { BrowserWindow } from 'electron';
import { existsSync, readFileSync, writeFileSync } from 'fs-extra';
import path from 'path';
import vm from 'vm';

import { moduleFunction, NativeBridgeModule, nativeBridgeModule } from '../module';

@nativeBridgeModule('config')
export class ConfigModule extends NativeBridgeModule {
  private config: Config = DEFAULT_CONFIG;

  @moduleFunction()
  public async get(_mainWindow: BrowserWindow): Promise<Config> {
    return this.config;
  }

  @moduleFunction()
  public async getConfigPath(_mainWindow: BrowserWindow): Promise<string> {
    const dirs = appDirs({ appName: 'TerminalOne' });
    return path.join(dirs.config, 'config.js');
  }

  public onRegistered(_mainWindow: BrowserWindow): void {
    const dirs = appDirs({ appName: 'TerminalOne' });
    const configPath = path.join(dirs.config, 'config.js');
    if (!existsSync(configPath)) {
      writeFileSync(configPath, 'module.exports = {};');
    }

    const configContent = readFileSync(configPath, 'utf8');

    try {
      const script = new vm.Script(configContent, { filename: 'config.js', displayErrors: true });
      const mod: Record<string, any> = {};
      script.runInNewContext({ mod });
      if (!mod.exports) {
        throw new Error('Error reading configuration: `module.exports` not set');
      }

      this.config = {
        ...this.config,
        ...mod.exports,
      };
    } catch (_err) {
      // TODO: log error
    }
  }
}
