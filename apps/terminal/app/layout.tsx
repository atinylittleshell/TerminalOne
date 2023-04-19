import './globals.css';
import 'xterm/css/xterm.css';

import { Metadata } from 'next/types';
import { ReactNode } from 'react';

import TitleBar from '../components/TitleBar';

export const metadata: Metadata = {
  title: 'Terminal One',
  viewport: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no',
  icons: '/favicon.ico',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="h-screen w-screen flex flex-col">
        <TitleBar />
        <div className="flex-1 flex flex-col">{children}</div>
      </body>
    </html>
  );
}
