'use client';

import { PropsWithChildren } from 'react';

import { ConfigContextProvider } from '../../hooks/ConfigContext';
import { LogContextProvider } from '../../hooks/LogContext';

const ClientSideProviders = (props: PropsWithChildren) => {
  return (
    <LogContextProvider>
      <ConfigContextProvider>{props.children}</ConfigContextProvider>
    </LogContextProvider>
  );
};

export default ClientSideProviders;
