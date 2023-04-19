'use client';

import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

const Terminal = () => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!terminalRef.current) {
      return;
    }

    const terminal = new XTerm();
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    window.setTimeout(() => {
      fitAddon.fit();
    }, 1000);

    terminal.open(terminalRef.current);

    terminal.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');

    return () => {
      terminal.dispose();
    };
  }, [terminalRef]);

  return <div className="flex-1 w-full h-full relative" ref={terminalRef} />;
};

export default Terminal;
