import './globals.css';
import 'xterm/css/xterm.css';

import { Metadata } from 'next/types';
import { ReactNode } from 'react';

import ClientSideProviders from '../components/ClientSideProviders';

export const metadata: Metadata = {
  title: 'Terminal One',
  viewport: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no',
  icons: '/favicon.ico',
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" data-theme="black">
      <body className="h-screen w-screen flex flex-col overflow-hidden bg-black">
        <ClientSideProviders>{children}</ClientSideProviders>
      </body>
    </html>
  );
};

export default Layout;
