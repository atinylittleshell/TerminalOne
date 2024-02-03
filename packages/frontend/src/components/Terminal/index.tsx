import { error } from 'tauri-plugin-log-api';
import { onMount } from 'solid-js';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import { WebglAddon } from 'xterm-addon-webgl';
import {
  createTerminalIfNotExist,
  resizeTerminal,
  writeToTerminal,
} from '../../utils/backend';
import { appWindow } from '@tauri-apps/api/window';

export const Terminal = ({ terminalId }: { terminalId: string }) => {
  let terminalRef: HTMLDivElement | undefined = undefined;
  let xtermRef: XTerm | undefined;

  onMount(() => {
    if (!window) {
      return;
    }
    if (!terminalRef) {
      return;
    }

    const xtermDiv = terminalRef;

    // TODO: refactor this into multiple effects
    const xterm = new XTerm({
      allowProposedApi: true,
      allowTransparency: true,
    });
    xtermRef = xterm;

    const webglAddon = new WebglAddon();
    xterm.loadAddon(webglAddon);

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);

    xterm.loadAddon(new Unicode11Addon());
    xterm.unicode.activeVersion = '11';

    xterm.open(xtermDiv);

    createTerminalIfNotExist(
      terminalId,
      xterm.cols,
      xterm.rows,
      '/bin/bash',
      '',
    ).then(() => {
      xterm.onData((data) => {
        writeToTerminal(terminalId, data);
      });
      xterm.onResize(({ cols, rows }) => {
        resizeTerminal(terminalId, cols, rows);
      });

      appWindow.listen('terminal_read', (event) => {
        const payload = event.payload as {
          terminal_id: string;
          data: string;
        };
        if (payload.terminal_id !== terminalId) {
          return;
        }
        xterm.write(payload.data);
      });

      // make backend pty size consistent with xterm on the frontend
      fitAddon.fit();
      resizeTerminal(terminalId, xterm.cols, xterm.rows);
    });

    const resizeListener = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', resizeListener);

    const focusListener = () => {
      fitAddon.fit();
    };
    xterm.textarea?.addEventListener('focus', focusListener);

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
      xterm.textarea?.removeEventListener('focus', focusListener);
      xtermDiv.removeEventListener('contextmenu', contextMenuListener);

      try {
        xterm.dispose();
      } catch (e) {
        error(`failed to dispose terminal: ${e}`);
      }
    };
  });

  return (
    <div
      class="w-full h-full relative overflow-hidden border-none outline-0"
      tabIndex={1}
      ref={terminalRef}
    />
  );
};
