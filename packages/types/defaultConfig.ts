import type { ResolvedConfig } from './config';

/*
 * This is the default configuration values for Terminal One.
 */
export const DEFAULT_CONFIG: ResolvedConfig = {
  // Number of lines to keep in the scrollback buffer.
  scrollback: 10000,

  // Whether to blink the cursor.
  cursorBlink: true,

  // Style of the cursor. Valid values are 'block', 'underline', and 'bar'.
  cursorStyle: 'bar',

  // Width of the cursor in pixels.
  cursorWidth: 1,

  // Font size in pixels.
  fontSize: 16,

  // Font family. Follows css syntax.
  fontFamily: 'Consolas, Menlo, monospace',

  // Font weight for normal text. Valid values are 100-900 in multiples of 100.
  fontWeight: 400,

  // Font weight for bold text. Valid values are 100-900 in multiples of 100.
  fontWeightBold: 700,

  // Letter spacing in pixels.
  letterSpacing: 1,

  // Line height relative to font size.
  lineHeight: 1,

  // Padding within each tab in pixels.
  tabContentPadding: {
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
  },

  // Configuration for all themes to be used in the terminal.
  themes: [
    {
      name: 'Default',
      background: '#000000',
      foreground: '#ffffff',
      cursor: '#ffffff',
      cursorAccent: '#000000',
      selectionBackground: '#ffffff',
      selectionForeground: '#000000',
      selectionInactiveBackground: '#ffffff',
      black: '#000000',
      white: '#ffffff',
      red: '#ff0000',
      green: '#00ff00',
      blue: '#0000ff',
      yellow: '#ffff00',
      cyan: '#00ffff',
      magenta: '#ff00ff',
      brightBlack: '#808080',
      brightWhite: '#ffffff',
      brightRed: '#ff0000',
      brightGreen: '#00ff00',
      brightBlue: '#0000ff',
      brightYellow: '#ffff00',
      brightCyan: '#00ffff',
      brightMagenta: '#ff00ff',
    },
  ],

  // Configuration for all shells to be used in the terminal.
  shells: [
    {
      // Name of the shell.
      name: 'Default',

      // Command used to launch the shell. Will auto detect system shell when this is empty
      command: '',

      // Path to the directory where the shell should be launched. Will auto detect home directory when this is empty
      startupDirectory: '',

      // Name of the theme to use for this shell. This must match one of the names defined in "themes".
      themeName: 'Default',
    },
  ],

  // Name of the default shell to use. This must match one of the names defined in "shells".
  defaultShellName: 'Default',
};