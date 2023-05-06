'use client';

import { DEFAULT_CONFIG } from '@terminalone/types';
import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { WebglAddon } from 'xterm-addon-webgl';

import { useConfigContext } from '../../hooks/ConfigContext';

let nextId = 0;

const Terminal = ({ active, shellName }: { active: boolean; shellName: string }) => {
  const { config, loading } = useConfigContext();
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!terminalRef.current) {
      return;
    }
    if (!window || !window.TerminalOne) {
      return;
    }
    if (loading) {
      return;
    }

    const xtermDiv = terminalRef.current;

    // TODO: refactor this into multiple effects
    const xterm = new XTerm({
      allowProposedApi: true,
    });
    xterm.loadAddon(
      new WebLinksAddon((_e, url) => {
        window.TerminalOne?.links.openExternalURL(url);
      }),
    );

    const webglAddon = new WebglAddon();
    xterm.loadAddon(webglAddon);

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);

    xterm.loadAddon(new Unicode11Addon());
    xterm.unicode.activeVersion = '11';

    xterm.open(xtermDiv);

    const terminalId = (nextId++).toString();
    const activeShellConfig = config.shells.find((s) => s.name === shellName) || DEFAULT_CONFIG.shells[0];
    // when the following values are empty, they will be auto determined based on system defaults
    const shellCommand = activeShellConfig.command;
    const startupDirectory = activeShellConfig.startupDirectory;
    const theme = config.themes.find((t) => t.name === activeShellConfig.themeName) || DEFAULT_CONFIG.themes[0];

    xterm.options.cursorBlink = config.cursorBlink;
    xterm.options.cursorStyle = config.cursorStyle;
    xterm.options.cursorWidth = config.cursorWidth;
    xterm.options.scrollback = config.scrollback;
    xterm.options.fontSize = config.fontSize;
    xterm.options.fontFamily = config.fontFamily;
    xterm.options.fontWeight = config.fontWeight;
    xterm.options.fontWeightBold = config.fontWeightBold;
    xterm.options.letterSpacing = config.letterSpacing;
    xterm.options.lineHeight = config.lineHeight;
    xterm.options.theme = theme;

    window.TerminalOne?.terminal
      .newTerminal(terminalId, xterm.cols, xterm.rows, shellCommand, startupDirectory)
      .then(() => {
        xterm.onData((data) => {
          window.TerminalOne?.terminal?.writeTerminal(terminalId, data);
        });
        xterm.onResize(({ cols, rows }) => {
          window.TerminalOne?.terminal?.resizeTerminal(terminalId, cols, rows);
        });
        window.TerminalOne?.terminal?.onData((_e, id: string, data: string) => {
          if (id !== terminalId) {
            return;
          }
          xterm.write(data);
        });

        // make backend pty size consistent with xterm on the frontend
        window.TerminalOne?.terminal?.resizeTerminal(terminalId, xterm.cols, xterm.rows);
      });

    const resizeListener = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', resizeListener);

    const focusListener = () => {
      fitAddon.fit();
      xterm.focus();
    };
    xtermDiv.addEventListener('focus', focusListener);

    const mouseUpListener = () => {
      if (config.copyOnSelect && xterm.hasSelection()) {
        const selectedText = xterm.getSelection();
        navigator.clipboard.writeText(selectedText);
      }
    };
    xtermDiv.addEventListener('mouseup', mouseUpListener);

    const contextMenuListener = () => {
      navigator.clipboard.readText().then((text) => {
        if (text) {
          xterm.paste(text);
        }
      });
    };
    xtermDiv.addEventListener('contextmenu', contextMenuListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
      xtermDiv.removeEventListener('focus', focusListener);
      xtermDiv.removeEventListener('mouseup', mouseUpListener);
      xtermDiv.removeEventListener('contextmenu', contextMenuListener);

      window.TerminalOne?.terminal?.killTerminal(terminalId);
      xterm.dispose();
    };
  }, [terminalRef, shellName, config, loading]);

  useEffect(() => {
    if (!terminalRef.current) {
      return;
    }

    if (active) {
      terminalRef.current.focus();
    }
  }, [terminalRef, active]);

  return (
    <div
      className={`flex-1 w-full h-full absolute overflow-hidden ${active ? 'visible' : 'invisible'}`}
      tabIndex={1}
      ref={terminalRef}
    />
  );
};

export default Terminal;
