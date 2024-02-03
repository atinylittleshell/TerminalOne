import {
  ParentProps,
  createContext,
  createEffect,
  createSignal,
  useContext,
} from 'solid-js';
import { Config } from '../../types/config';
import { getConfig, getConfigPath } from '../../utils/backend';
import { DEFAULT_CONFIG } from './defaultConfig';
import { debug } from 'tauri-plugin-log-api';

interface IConfigContextData {
  config: Config;
  configPath: string;
  loading?: boolean;
}

const DEFAULT_CONFIG_CONTEXT_DATA: IConfigContextData = {
  config: DEFAULT_CONFIG,
  configPath: '',
  loading: true,
};

const ConfigContext = createContext<IConfigContextData>(
  DEFAULT_CONFIG_CONTEXT_DATA,
);

export const ConfigContextProvider = (props: ParentProps) => {
  const [data, setData] = createSignal<IConfigContextData>(
    DEFAULT_CONFIG_CONTEXT_DATA,
  );

  createEffect(() => {
    Promise.all([getConfig(), getConfigPath()]).then(([cfg, path]) => {
      debug(`Config loaded on frontend: ${JSON.stringify(cfg, null, 2)}`);

      if (cfg && path) {
        setData({
          config: cfg,
          configPath: path,
          loading: false,
        });
      }
    });
  }, []);

  return (
    <ConfigContext.Provider value={data()}>
      {props.children}
    </ConfigContext.Provider>
  );
};

export const useConfigContext = () => {
  const contextData = useContext(ConfigContext);
  return contextData;
};
