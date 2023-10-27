'use client';

import { PropsWithChildren } from 'react';

import { ConfigContextProvider } from '../../hooks/ConfigContext';
import { KeybindContextProvider } from '../../hooks/KeybindContext';

const ClientSideProviders = (props: PropsWithChildren) => {
  return (
    <ConfigContextProvider>
      <KeybindContextProvider>{props.children}</KeybindContextProvider>
    </ConfigContextProvider>
  );
};

export default ClientSideProviders;
