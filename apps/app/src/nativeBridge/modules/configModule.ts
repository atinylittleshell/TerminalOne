import { DEFAULT_CONFIG, Logger, resolveConfig, ResolvedConfig } from '@terminalone/types';
import { BrowserWindow } from 'electron';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs-extra';
import path from 'path';
import vm from 'vm';

import { moduleFunction, NativeBridgeModule, nativeBridgeModule } from '../module';
import { getAppDirs } from './common';

@nativeBridgeModule('config')
export class ConfigModule extends NativeBridgeModule {
  private config: ResolvedConfig = DEFAULT_CONFIG;

  @moduleFunction()
  public async getConfig(_mainWindow: BrowserWindow): Promise<ResolvedConfig> {
    return this.config;
  }

  @moduleFunction()
  public async getConfigPath(_mainWindow: BrowserWindow): Promise<string> {
    return path.join(getAppDirs().config, 'config.js');
  }

  public onRegistered(_mainWindow: BrowserWindow): void {
    const configDir = getAppDirs().config;
    const configPath = path.join(configDir, 'config.js');
    if (!existsSync(configPath)) {
      mkdirSync(configDir, { recursive: true });
      writeFileSync(configPath, 'module.exports = {};');
    }

    const configContent = readFileSync(configPath, 'utf8');

    try {
      const script = new vm.Script(configContent, { filename: 'config.js', displayErrors: true });
      const mod: Record<string, any> = {};
      script.runInNewContext({ module: mod });
      if (!mod.exports) {
        throw new Error('Invalid config: `module.exports` not set');
      }

      const resolved = resolveConfig(mod.exports);
      this.config = resolved;
    } catch (err: any) {
      Logger.getInstance().error(JSON.stringify(err));
    }
  }
}
