import type { ResolvedConfig } from './config';

/*
 * This is the default configuration values for Terminal One.
 */
export const DEFAULT_CONFIG: ResolvedConfig = {
  // Whether to use acrylic effect on the window background. This is only supported on Mac and Win 11.
  acrylic: true,

  // Number of lines to keep in the scrollback buffer.
  scrollback: 10000,

  // Whether to copy text to the clipboard on selection.
  copyOnSelect: true,

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

  // Padding within each terminal in pixels.
  terminalContentPadding: {
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
  },

  // Border width of each terminal in pixels.
  terminalBorderWidth: 1,

  // Border color of each terminal when it is active.
  terminalBorderColorActive: 'foreground',

  // Border color of each terminal when it is inactive.
  terminalBorderColorInactive: 'background',

  // Configuration for the color scheme. Default is https://rosepinetheme.com/.
  colorScheme: {
    cursor: '#56526e',
    cursorAccent: '#e0def4',

    selectionBackground: '#312f44',
    selectionForeground: '#e0def4',
    selectionInactiveBackground: '#312f44',

    background: '#232136',
    foreground: '#e0def4',

    black: '#393552',
    blue: '#9ccfd8',
    cyan: '#ea9a97',
    green: '#3e8fb0',
    magenta: '#c4a7e7',
    red: '#eb6f92',
    white: '#e0def4',
    yellow: '#f6c177',

    brightBlack: '#817c9c',
    brightBlue: '#9ccfd8',
    brightCyan: '#ea9a97',
    brightGreen: '#3e8fb0',
    brightMagenta: '#c4a7e7',
    brightRed: '#eb6f92',
    brightWhite: '#e0def4',
    brightYellow: '#f6c177',
  },

  // Configuration for all shells to be used in the terminal.
  shells: [
    {
      // Name of the shell.
      name: 'Default',

      // Command used to launch the shell. Will auto detect system shell when this is empty.
      command: '',

      // Path to the directory where the shell should be launched. Will auto detect home directory when this is empty.
      startupDirectory: '',
    },
  ],

  // Name of the default shell to use. This must match one of the names defined in "shells".
  defaultShellName: 'Default',

  // The keybind to use as the leader key. This keybind will be used to trigger all other keybinds.
  // Pressing this keybind twice will "escape" the leader and send the key into the terminal.
  keybindLeader: 'ctrl+b',

  // Keybinds to use for the terminal.
  // These keybinds will be active only within 1 second after the leader key is pressed.
  keybinds: {
    createTab: 'c',
    closeTab: 'shift+&',
    nextTab: 'n',
    previousTab: 'p',
    tab1: '1',
    tab2: '2',
    tab3: '3',
    tab4: '4',
    tab5: '5',
    tab6: '6',
    tab7: '7',
    tab8: '8',
    tab9: '9',
    splitHorizontal: 'shift+%',
    splitVertical: 'shift+"',
    focusPaneLeft: 'h',
    focusPaneRight: 'l',
    focusPaneUp: 'k',
    focusPaneDown: 'j',
    closePane: 'x',
  },
};
