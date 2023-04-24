import { DEFAULT_CONFIG, resolveConfig, ResolvedConfig } from '@terminalone/types';
import appDirs from 'appdirsjs';
import { BrowserWindow } from 'electron';
import { existsSync, readFileSync, writeFileSync } from 'fs-extra';
import path from 'path';
import vm from 'vm';

import { moduleFunction, NativeBridgeModule, nativeBridgeModule } from '../module';

@nativeBridgeModule('config')
export class ConfigModule extends NativeBridgeModule {
  private config: ResolvedConfig = DEFAULT_CONFIG;

  @moduleFunction()
  public async getConfig(_mainWindow: BrowserWindow): Promise<ResolvedConfig> {
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
        throw new Error('Invalid config: `module.exports` not set');
      }

      const resolved = resolveConfig(mod.exports);
      this.config = resolved;
    } catch (_err) {
      // TODO: report error
    }
  }
}
