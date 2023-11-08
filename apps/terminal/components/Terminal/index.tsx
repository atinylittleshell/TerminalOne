'use client';

import { DEFAULT_CONFIG } from '@terminalone/types';
import { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { WebglAddon } from 'xterm-addon-webgl';

import { useConfigContext } from '../../hooks/ConfigContext';
import { useKeybindContext } from '../../hooks/KeybindContext';
import { useTabContext } from '../../hooks/TabContext';
import ShellSelector from '../ShellSelector';

const Terminal = ({
  terminalId,
  useDefaultShell,
}: {
  terminalId: string;
  useDefaultShell: boolean;
}) => {
  const { config, loading } = useConfigContext();
  const [shellName, setShellName] = useState<string | null | undefined>(
    undefined,
  );
  const { handleKey } = useKeybindContext();
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const { root, activeTerminalId, onTerminalActive, onTerminalCreated } =
    useTabContext();

  useEffect(() => {
    if (loading || shellName !== undefined) {
      return;
    }

    if (useDefaultShell) {
      setShellName(config.defaultShellName);
    } else if (config.shells.length === 1) {
      setShellName(config.shells[0].name);
    } else {
      setShellName(null);
    }
  }, [config, loading, useDefaultShell, shellName]);

  useEffect(() => {
    if (!window || !window.TerminalOne) {
      return;
    }
    if (!shellName) {
      if (shellName === null) {
        onTerminalActive(null);
      }
      return;
    }
    if (!terminalRef.current) {
      return;
    }

    window.TerminalOne?.app.log(
      'debug',
      `${terminalId} creating terminal with shell: ${shellName}`,
    );

    const xtermDiv = terminalRef.current!;

    // TODO: refactor this into multiple effects
    const xterm = new XTerm({
      allowProposedApi: true,
    });
    xtermRef.current = xterm;

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

    const activeShellConfig =
      config.shells.find((s) => s.name === shellName) ||
      DEFAULT_CONFIG.shells[0];
    // when the following values are empty, they will be auto determined based on system defaults
    const shellCommand = activeShellConfig.command;
    const startupDirectory = activeShellConfig.startupDirectory;

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
    xterm.options.theme = config.colorScheme;

    window.TerminalOne?.terminal
      .createTerminalIfNotExist(
        terminalId,
        xterm.cols,
        xterm.rows,
        shellCommand,
        startupDirectory,
      )
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
        fitAddon.fit();
        window.TerminalOne?.terminal?.resizeTerminal(
          terminalId,
          xterm.cols,
          xterm.rows,
        );
      });

    const resizeListener = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', resizeListener);

    const focusListener = () => {
      fitAddon.fit();
      onTerminalActive(terminalId);
    };
    xterm.textarea?.addEventListener('focus', focusListener);

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

    xterm.attachCustomKeyEventHandler((event) => {
      return handleKey(event, terminalId);
    });

    onTerminalCreated(terminalId);

    return () => {
      window.removeEventListener('resize', resizeListener);
      xterm.textarea?.removeEventListener('focus', focusListener);
      xtermDiv.removeEventListener('mouseup', mouseUpListener);
      xtermDiv.removeEventListener('contextmenu', contextMenuListener);

      xterm.dispose();
    };
  }, [
    terminalRef,
    shellName,
    terminalId,
    config,
    handleKey,
    onTerminalActive,
    onTerminalCreated,
  ]);

  useEffect(() => {
    if (!terminalRef.current) {
      return;
    }

    window.TerminalOne?.app.log(
      'debug',
      `${terminalId} get active terminal id: ${activeTerminalId}`,
    );

    if (activeTerminalId === terminalId) {
      xtermRef.current?.focus();
    } else {
      xtermRef.current?.blur();
    }
  }, [terminalRef, xtermRef, activeTerminalId, terminalId]);

  if (shellName === undefined) {
    return <div />;
  }

  let child = <ShellSelector onShellSelected={setShellName} />;
  if (shellName !== null) {
    child = (
      <div
        className="w-full h-full relative overflow-hidden border-none outline-0"
        tabIndex={1}
        ref={terminalRef}
      />
    );
  }

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        paddingTop: config.terminalContentPadding.top,
        paddingRight: config.terminalContentPadding.right,
        paddingBottom: config.terminalContentPadding.bottom,
        paddingLeft: config.terminalContentPadding.left,
        borderWidth: config.terminalBorderWidth,
        borderColor:
          // show active border when the terminal is active but is not root.
          // or when it's on shell selector
          (terminalId === activeTerminalId || shellName === null) &&
          (root.nodeType !== 'terminal' || root.terminalId !== terminalId)
            ? config.terminalBorderColorActive
            : config.terminalBorderColorInactive,
      }}
    >
      {child}
    </div>
  );
};

export default Terminal;
