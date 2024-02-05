import { createContext, createEffect, ParentProps, useContext } from 'solid-js';
import { createStore } from 'solid-js/store';
import { debug, error } from 'tauri-plugin-log-api';

import { Config } from '../../types/config';
import { getConfig, getConfigPath } from '../../utils/backend';
import { DEFAULT_CONFIG } from './defaultConfig';
import { resolveConfig } from './resolveConfig';

type ConfigContextData = {
  data: Config;
  path: string;
  error: string | null;
  loading: boolean;
};

const DEFAULT_CONTEXT_DATA: ConfigContextData = {
  data: DEFAULT_CONFIG,
  path: '',
  error: null,
  loading: true,
};

const ConfigContext = createContext<ConfigContextData>(DEFAULT_CONTEXT_DATA);

export const ConfigProvider = (props: ParentProps) => {
  const [data, setData] = createStore<ConfigContextData>(DEFAULT_CONTEXT_DATA);

  createEffect(() => {
    async function load() {
      const [rawCfg, cfgPath] = await Promise.all([
        getConfig(),
        getConfigPath(),
      ]);

      try {
        const cfg = await resolveConfig(rawCfg);
        debug(`Config loaded on frontend: ${JSON.stringify(cfg, null, 2)}`);

        setData({
          data: cfg,
          path: cfgPath,
          error: null,
          loading: false,
        });
      } catch (err: unknown) {
        const e = err as Error;

        error(`Error loading config: ${e.message}`);

        setData({
          data: DEFAULT_CONFIG,
          path: cfgPath,
          error: e.message,
          loading: false,
        });
      }
    }

    load();
  });

  return (
    <ConfigContext.Provider value={data}>
      {props.children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  return useContext(ConfigContext);
};
