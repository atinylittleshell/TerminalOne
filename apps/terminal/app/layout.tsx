import './globals.css';
import 'xterm/css/xterm.css';

import dynamic from 'next/dynamic';
import { Metadata } from 'next/types';
import { ReactNode } from 'react';

const TitleBar = dynamic(() => import('../components/TitleBar'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Terminal One',
  viewport: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no',
  icons: '/favicon.ico',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="black">
      <body className="h-screen w-screen flex flex-col overflow-hidden bg-black">
        <TitleBar />
        <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
      </body>
    </html>
  );
}
