import { ParentProps, createContext, createEffect, useContext } from 'solid-js';
import { Config } from '../../types/config';
import { getConfig, getConfigPath } from '../../utils/backend';
import { DEFAULT_CONFIG } from './defaultConfig';
import { debug, error } from 'tauri-plugin-log-api';
import { resolveConfig } from './resolveConfig';
import { createStore } from 'solid-js/store';

interface IConfigContextData {
  config: Config;
  configPath: string;
  error: string | null;
  loading?: boolean;
}

const DEFAULT_CONFIG_CONTEXT_DATA: IConfigContextData = {
  config: DEFAULT_CONFIG,
  configPath: '',
  error: null,
  loading: true,
};

const ConfigContext = createContext<IConfigContextData>(
  DEFAULT_CONFIG_CONTEXT_DATA,
);

export const ConfigContextProvider = (props: ParentProps) => {
  const [data, setData] = createStore<IConfigContextData>(
    DEFAULT_CONFIG_CONTEXT_DATA,
  );

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
          config: cfg,
          configPath: cfgPath,
          error: null,
          loading: false,
        });
      } catch (e: any) {
        error(`Error loading config: ${e.message}`);

        setData({
          config: DEFAULT_CONFIG,
          configPath: cfgPath,
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

export const useConfigContext = () => {
  const contextData = useContext(ConfigContext);
  return contextData;
};
