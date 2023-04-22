'use client';

import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { CanvasAddon } from 'xterm-addon-canvas';
import { FitAddon } from 'xterm-addon-fit';

let nextId = 0;

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

    const terminalId = (nextId++).toString();
    window.TerminalOne.terminal?.newTerminal(terminalId, terminal.cols, terminal.rows).then(() => {
      terminal.onData((data) => {
        window.TerminalOne.terminal?.writeTerminal(terminalId, data);
      });
      terminal.onResize(({ cols, rows }) => {
        window.TerminalOne.terminal?.resizeTerminal(terminalId, cols, rows);
      });
      window.TerminalOne.terminal?.onData((_e, id: string, data: string) => {
        if (id !== terminalId) {
          return;
        }
        terminal.write(data);
      });
    });

    const resizeListener = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
      terminal.dispose();
      window.TerminalOne.terminal?.killTerminal(terminalId);
    };
  }, [terminalRef]);

  return <div className="flex-1 relative overflow-hidden" ref={terminalRef} />;
};

export default Terminal;
