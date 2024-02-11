import { clipboard } from '@tauri-apps/api';
import { appWindow } from '@tauri-apps/api/window';
import EventEmitter from 'eventemitter3';
import { createContext, ParentProps, useContext } from 'solid-js';
import { debug } from 'tauri-plugin-log-api';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Unicode11Addon } from 'xterm-addon-unicode11';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { WebglAddon } from 'xterm-addon-webgl';

import { Config } from '../../types/config';
import {
  createTerminalIfNotExist,
  killTerminal,
  resizeTerminal,
  writeToTerminal,
} from '../../utils/backend';
import { DEFAULT_CONFIG } from '../ConfigProvider/defaultConfig';

type TerminalEventMap = {
  active: undefined;
};

type TerminalContext = {
  terminal: XTerm;
  terminalDiv: HTMLDivElement;
  cleanUp: () => void;
  events: EventEmitter<TerminalEventMap>;
};

type TerminalsManagerContextData = {
  getOrCreateTerminal: (
    id: string,
    config: Config,
    shellName: string,
    handleKey: (event: KeyboardEvent, srcTerminalId: string) => boolean,
  ) => TerminalContext;
  disposeTerminal: (id: string) => void;
};

const terminals = new Map<string, TerminalContext>();

const CONTEXT_DATA: TerminalsManagerContextData = {
  getOrCreateTerminal: (
    id: string,
    config: Config,
    shellName: string,
    handleKey: (event: KeyboardEvent, srcTerminalId: string) => boolean,
  ) => {
    if (terminals.has(id)) {
      return terminals.get(id)!;
    }

    const events = new EventEmitter<TerminalEventMap>();

    const terminalDiv = document.createElement('div');
    terminalDiv.tabIndex = 1;
    terminalDiv.id = `terminal-${id}`;
    terminalDiv.style.width = '100%';
    terminalDiv.style.height = '100%';
    terminalDiv.style.position = 'relative';
    terminalDiv.style.overflow = 'hidden';
    terminalDiv.style.border = 'none';
    terminalDiv.style.outline = '0';
    terminalDiv.style.visibility = 'hidden';
    document.body.appendChild(terminalDiv);

    const terminal = new XTerm({
      allowProposedApi: true,
      allowTransparency: true,
    });

    terminal.loadAddon(
      new WebLinksAddon((_e, url) => {
        open(url);
      }),
    );

    const webglAddon = new WebglAddon();
    terminal.loadAddon(webglAddon);

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);

    terminal.loadAddon(new Unicode11Addon());
    terminal.unicode.activeVersion = '11';

    terminal.open(terminalDiv);

    const activeShellConfig =
      config.shells.find((s) => s.name === shellName) ||
      DEFAULT_CONFIG.shells[0];
    // when the following values are empty, they will be auto determined based on system defaults
    const shellCommand = activeShellConfig.command;
    const startupDirectory = activeShellConfig.startup_directory;

    terminal.options.cursorBlink = config.cursor_blink;
    terminal.options.cursorStyle = config.cursor_style;
    terminal.options.cursorWidth = config.cursor_width;
    terminal.options.scrollback = config.scrollback;
    terminal.options.fontSize = config.font_size;
    terminal.options.fontFamily = config.font_family;
    terminal.options.fontWeight = config.font_weight;
    terminal.options.fontWeightBold = config.font_weight_bold;
    terminal.options.letterSpacing = config.letter_spacing;
    terminal.options.lineHeight = config.line_height;
    terminal.options.theme = {
      background: config.color_scheme.background,
      foreground: config.color_scheme.foreground,
      cursor: config.color_scheme.cursor,
      cursorAccent: config.color_scheme.cursor_accent,
      selectionBackground: config.color_scheme.selection_background,
      selectionForeground: config.color_scheme.selection_foreground,
      selectionInactiveBackground:
        config.color_scheme.selection_inactive_background,
      black: config.color_scheme.black,
      red: config.color_scheme.red,
      green: config.color_scheme.green,
      yellow: config.color_scheme.yellow,
      blue: config.color_scheme.blue,
      magenta: config.color_scheme.magenta,
      cyan: config.color_scheme.cyan,
      white: config.color_scheme.white,
      brightBlack: config.color_scheme.bright_black,
      brightRed: config.color_scheme.bright_red,
      brightGreen: config.color_scheme.bright_green,
      brightYellow: config.color_scheme.bright_yellow,
      brightBlue: config.color_scheme.bright_blue,
      brightMagenta: config.color_scheme.bright_magenta,
      brightCyan: config.color_scheme.bright_cyan,
      brightWhite: config.color_scheme.bright_white,
    };

    createTerminalIfNotExist(
      id,
      terminal.cols,
      terminal.rows,
      shellCommand,
      startupDirectory,
    ).then(() => {
      terminal.onData((data) => {
        writeToTerminal(id, data);
      });
      terminal.onResize(({ cols, rows }) => {
        resizeTerminal(id, cols, rows);
      });

      appWindow.listen('terminal_read', (event) => {
        const payload = event.payload as {
          terminal_id: string;
          data: string;
        };
        if (payload.terminal_id !== id) {
          return;
        }
        terminal.write(payload.data);
      });

      // onExit

      // make backend pty size consistent with xterm on the frontend
      fitAddon.fit();
      resizeTerminal(id, terminal.cols, terminal.rows);

      events.emit('active');
    });

    const resizeListener = () => {
      fitAddon.fit();
    };
    window.addEventListener('resize', resizeListener);

    const focusListener = () => {
      fitAddon.fit();
      events.emit('active');
    };
    terminal.textarea?.addEventListener('focus', focusListener);

    const contextMenuListener = () => {
      clipboard.readText().then((text) => {
        if (text) {
          terminal.paste(text);
        }
      });
    };
    terminalDiv.addEventListener('contextmenu', contextMenuListener);

    terminal.attachCustomKeyEventHandler((event) => {
      return handleKey(event, id);
    });

    terminals.set(id, {
      terminal,
      terminalDiv,
      cleanUp: () => {
        window.removeEventListener('resize', resizeListener);
        terminal.textarea?.removeEventListener('focus', focusListener);
        terminalDiv.removeEventListener('contextmenu', contextMenuListener);

        terminal.dispose();
        terminalDiv.remove();
      },
      events,
    });

    return terminals.get(id)!;
  },
  disposeTerminal: (id: string) => {
    if (terminals.has(id)) {
      const { cleanUp } = terminals.get(id)!;

      cleanUp();
      terminals.delete(id);
      killTerminal(id).then(() => {
        debug(`Terminal ${id} killed`);
      });
    }
  },
};

const TerminalsManagerContext =
  createContext<TerminalsManagerContextData>(CONTEXT_DATA);

export const TerminalsManagerProvider = (props: ParentProps) => {
  return (
    <TerminalsManagerContext.Provider value={CONTEXT_DATA}>
      {props.children}
    </TerminalsManagerContext.Provider>
  );
};

export const useTerminalsManager = () => {
  return useContext(TerminalsManagerContext);
};
