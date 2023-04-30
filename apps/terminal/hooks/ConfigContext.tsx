import { DEFAULT_CONFIG, ResolvedConfig } from '@terminalone/types';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface IConfigContextData {
  config: ResolvedConfig;
  configPath: string;
}

const ConfigContext = createContext<IConfigContextData>({
  config: DEFAULT_CONFIG,
  configPath: '',
});

export const ConfigContextProvider = (props: React.PropsWithChildren<{}>) => {
  const [config, setConfig] = useState<ResolvedConfig>(DEFAULT_CONFIG);
  const [configPath, setConfigPath] = useState<string>('');

  useEffect(() => {
    if (window && window.TerminalOne) {
      window.TerminalOne.config.getConfig().then((cfg) => {
        setConfig(cfg);
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
