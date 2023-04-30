'use client';

import { DEFAULT_CONFIG, ResolvedConfig } from '@terminalone/types';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface IConfigContextData {
  config: ResolvedConfig;
  configPath: string;
  loading?: boolean;
}

const DEFAULT_CONFIG_CONTEXT_DATA: IConfigContextData = {
  config: DEFAULT_CONFIG,
  configPath: '',
  loading: true,
};

const ConfigContext = createContext<IConfigContextData>(DEFAULT_CONFIG_CONTEXT_DATA);

export const ConfigContextProvider = (props: React.PropsWithChildren<{}>) => {
  const [data, setData] = useState<IConfigContextData>(DEFAULT_CONFIG_CONTEXT_DATA);

  useEffect(() => {
    window.TerminalOne?.config.getConfig().then((cfg) => {
      window.TerminalOne?.config.getConfigPath().then((path) => {
        setData({
          config: cfg,
          configPath: path,
          loading: false,
        });
      });
    });
  }, []);

  return <ConfigContext.Provider value={data}>{props.children}</ConfigContext.Provider>;
};

export const useConfigContext = () => {
  const contextData = useContext(ConfigContext);
  return contextData;
};
