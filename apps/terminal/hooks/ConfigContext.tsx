import { Config, DEFAULT_CONFIG } from '@terminalone/types';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface IConfigContextData {
  config: Config;
  configPath: string;
}

const ConfigContext = createContext<IConfigContextData>({
  config: DEFAULT_CONFIG,
  configPath: '',
});

export const ConfigContextProvider = (props: React.PropsWithChildren<{}>) => {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG);
  const [configPath, setConfigPath] = useState<string>('');

  useEffect(() => {
    if (window && window.TerminalOne) {
      window.TerminalOne.config.get().then((config) => {
        setConfig(config);
      });
      window.TerminalOne.config.getConfigPath().then((path) => {
        setConfigPath(path);
      });
    }
  }, []);

  return (
    <ConfigContext.Provider
      value={{
        config: config,
        configPath: configPath,
      }}
    >
      {props.children}
    </ConfigContext.Provider>
  );
};

export const useConfigContext = () => {
  const contextData = useContext(ConfigContext);
  return contextData;
};
