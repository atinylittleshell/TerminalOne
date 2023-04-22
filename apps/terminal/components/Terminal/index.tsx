'use client';

import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { CanvasAddon } from 'xterm-addon-canvas';
import { FitAddon } from 'xterm-addon-fit';

const Terminal = () => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!terminalRef.current) {
      return;
    }

    const terminalDiv = terminalRef.current;

    const terminal = new XTerm({
      scrollback: 0,
    });
    terminal.loadAddon(new CanvasAddon());

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(terminalDiv);

    window.setTimeout(() => {
      fitAddon.fit();
    }, 1);

    terminal.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');

    const resizeListener = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
      terminal.dispose();
    };
  }, [terminalRef]);

  return <div className="flex-1 relative overflow-hidden" ref={terminalRef} />;
};

export default Terminal;
