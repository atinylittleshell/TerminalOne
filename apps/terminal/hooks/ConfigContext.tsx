'use client';

import { DEFAULT_CONFIG, ResolvedConfig } from '@terminalone/types';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface IConfigContextData {
  config: ResolvedConfig;
  configPath: string;
  logPath: string;
  loading?: boolean;
}

const DEFAULT_CONFIG_CONTEXT_DATA: IConfigContextData = {
  config: DEFAULT_CONFIG,
  configPath: '',
  logPath: '',
  loading: true,
};

const ConfigContext = createContext<IConfigContextData>(
  DEFAULT_CONFIG_CONTEXT_DATA,
);

export const ConfigContextProvider = (props: React.PropsWithChildren) => {
  const [data, setData] = useState<IConfigContextData>(
    DEFAULT_CONFIG_CONTEXT_DATA,
  );

  useEffect(() => {
    Promise.all([
      window.TerminalOne?.config.getConfig(),
      window.TerminalOne?.config.getConfigPath(),
      window.TerminalOne?.app.getLogPath(),
    ]).then(([cfg, path, logPath]) => {
      if (cfg && path && logPath) {
        setData({
          config: cfg,
          configPath: path,
          logPath: logPath,
          loading: false,
        });
      }
    });
  }, []);

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
