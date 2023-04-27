import { isLeft } from 'fp-ts/Either';
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/PathReporter';

const ShellConfigType = t.type({
  name: t.string,
  command: t.string,
  startupDirectory: t.string,
  themeName: t.string,
});

export type ShellConfig = t.TypeOf<typeof ShellConfigType>;

const PaddingType = t.type({
  top: t.number,
  right: t.number,
  bottom: t.number,
  left: t.number,
});

export type Padding = t.TypeOf<typeof PaddingType>;

const ThemeConfigType = t.type({
  name: t.string,
  background: t.string,
  foreground: t.string,
  cursor: t.string,
  cursorAccent: t.string,
  selectionBackground: t.string,
  selectionForeground: t.string,
  selectionInactiveBackground: t.string,
  black: t.string,
  white: t.string,
  red: t.string,
  green: t.string,
  blue: t.string,
  yellow: t.string,
  cyan: t.string,
  magenta: t.string,
  brightBlack: t.string,
  brightWhite: t.string,
  brightRed: t.string,
  brightGreen: t.string,
  brightBlue: t.string,
  brightYellow: t.string,
  brightCyan: t.string,
  brightMagenta: t.string,
});

export type ThemeConfig = t.TypeOf<typeof ThemeConfigType>;

const ConfigTypeContent = {
  cursorBlink: t.boolean,
  cursorStyle: t.keyof({
    block: null,
    underline: null,
    bar: null,
  }),
  cursorWidth: t.number,
  scrollback: t.number,
  fontSize: t.number,
  fontFamily: t.string,
  fontWeight: t.number,
  fontWeightBold: t.number,
  tabContentPadding: PaddingType,
  themes: t.array(ThemeConfigType),
  shells: t.array(ShellConfigType),
  defaultShellName: t.string,
};

const ConfigType = t.partial(ConfigTypeContent);
export type Config = t.TypeOf<typeof ConfigType>;

export const validateConfig = (config: unknown): Config => {
  const decoded = ConfigType.decode(config);
  if (isLeft(decoded)) {
    throw Error(`Invalid config: ${PathReporter.report(decoded).join('\n')}`);
  }

  const result = decoded.right;
  if (result.scrollback !== undefined && result.scrollback < 0) {
    throw Error(`Invalid scrollback value: ${result.scrollback}`);
  }
  if (result.fontSize !== undefined && (result.fontSize <= 0 || result.fontSize > 128)) {
    throw Error(`Invalid font size: ${result.fontSize}`);
  }
  if (result.fontWeight !== undefined && (result.fontWeight <= 0 || result.fontWeight > 1000)) {
    throw Error(`Invalid font weight: ${result.fontWeight}`);
  }
  if (result.fontWeightBold !== undefined && (result.fontWeightBold <= 0 || result.fontWeightBold > 1000)) {
    throw Error(`Invalid font weight bold: ${result.fontWeightBold}`);
  }
  if (result.tabContentPadding !== undefined) {
    if (result.tabContentPadding.top < 0 || result.tabContentPadding.top > 128) {
      throw Error(`Invalid tab content padding top: ${result.tabContentPadding.top}`);
    }
    if (result.tabContentPadding.right < 0 || result.tabContentPadding.right > 128) {
      throw Error(`Invalid tab content padding right: ${result.tabContentPadding.right}`);
    }
    if (result.tabContentPadding.bottom < 0 || result.tabContentPadding.bottom > 128) {
      throw Error(`Invalid tab content padding bottom: ${result.tabContentPadding.bottom}`);
    }
    if (result.tabContentPadding.left < 0 || result.tabContentPadding.left > 128) {
      throw Error(`Invalid tab content padding left: ${result.tabContentPadding.left}`);
    }
  }
  if (
    (result.shells !== undefined || result.defaultShellName !== undefined) &&
    !(result.shells || []).find((shell) => shell.name === result.defaultShellName)
  ) {
    throw Error(`Could not find config for default shell: ${result.defaultShellName}`);
  }

  return result;
};

export const DEFAULT_CONFIG: ResolvedConfig = {
  scrollback: 10000,
  cursorBlink: false,
  cursorStyle: 'block',
  cursorWidth: 1,
  fontSize: 15,
  fontFamily: 'Consolas, Menlo, monospace',
  fontWeight: 500,
  fontWeightBold: 700,
  tabContentPadding: {
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
  },
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
  shells: [
    {
      name: 'Default',
      command: '', // will auto detect system shell when this is empty
      startupDirectory: '', // will auto detect home directory when this is empty
      themeName: 'Default',
    },
  ],
  defaultShellName: 'Default',
};

const ResolvedConfigType = t.type(ConfigTypeContent);
export type ResolvedConfig = t.TypeOf<typeof ResolvedConfigType>;

export const resolveConfig = (config: unknown): ResolvedConfig => {
  const validatedConfig = validateConfig(config);

  return {
    ...DEFAULT_CONFIG,
    ...validatedConfig,
  };
};
