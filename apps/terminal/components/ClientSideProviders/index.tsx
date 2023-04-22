'use client';

import { PropsWithChildren } from 'react';

import { ConfigContextProvider } from '../../hooks/ConfigContext';

const ClientSideProviders = (props: PropsWithChildren) => {
  return <ConfigContextProvider>{props.children}</ConfigContextProvider>;
};

export default ClientSideProviders;
