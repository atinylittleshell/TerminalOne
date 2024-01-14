import { isLeft } from 'fp-ts/Either';
import * as t from 'io-ts';
import { PathReporter } from 'io-ts/PathReporter';
import _ from 'lodash';

import { DEFAULT_CONFIG } from './defaultConfig';

const ShellConfigType = t.type({
  name: t.string,
  command: t.string,
  startupDirectory: t.string,
});

export type ShellConfig = t.TypeOf<typeof ShellConfigType>;

const PaddingType = t.type({
  top: t.number,
  right: t.number,
  bottom: t.number,
  left: t.number,
});

export type Padding = t.TypeOf<typeof PaddingType>;

const ColorSchemeConfigType = t.type({
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

export type ColorSchemeConfig = t.TypeOf<typeof ColorSchemeConfigType>;

const Keybinds = {
  createTab: t.string,
  closeTab: t.string,
  nextTab: t.string,
  previousTab: t.string,
  tab1: t.string,
  tab2: t.string,
  tab3: t.string,
  tab4: t.string,
  tab5: t.string,
  tab6: t.string,
  tab7: t.string,
  tab8: t.string,
  tab9: t.string,
  splitHorizontal: t.string,
  splitVertical: t.string,
  focusPaneLeft: t.string,
  focusPaneRight: t.string,
  focusPaneUp: t.string,
  focusPaneDown: t.string,
  closePane: t.string,
};

const ConfigTypeContent = {
  acrylic: t.boolean,
  cursorBlink: t.boolean,
  cursorStyle: t.keyof({
    block: null,
    underline: null,
    bar: null,
  }),
  cursorWidth: t.number,
  scrollback: t.number,
  copyOnSelect: t.boolean,
  fontSize: t.number,
  fontFamily: t.string,
  fontWeight: t.number,
  fontWeightBold: t.number,
  letterSpacing: t.number,
  lineHeight: t.number,
  terminalContentPadding: PaddingType,
  terminalBorderWidth: t.number,
  terminalBorderColorActive: t.string,
  terminalBorderColorInactive: t.string,
  colorScheme: ColorSchemeConfigType,
  shells: t.array(ShellConfigType),
  defaultShellName: t.string,
  keybindLeader: t.string,
  keybinds: t.partial(Keybinds),
};

const ConfigType = t.partial(ConfigTypeContent);
export type Config = t.TypeOf<typeof ConfigType>;

export type KeybindCommand = keyof typeof Keybinds;

export const validateConfig = (config: unknown): Config => {
  const decoded = ConfigType.decode(config);
  if (isLeft(decoded)) {
    throw Error(`Invalid config: ${PathReporter.report(decoded).join('\n')}`);
  }

  const result = decoded.right;
  if (result.scrollback !== undefined && result.scrollback < 0) {
    throw Error(`Invalid scrollback value: ${result.scrollback}`);
  }
  if (
    result.fontSize !== undefined &&
    (result.fontSize <= 0 || result.fontSize > 128)
  ) {
    throw Error(`Invalid font size: ${result.fontSize}`);
  }
  if (
    result.fontWeight !== undefined &&
    (result.fontWeight <= 0 || result.fontWeight > 1000)
  ) {
    throw Error(`Invalid font weight: ${result.fontWeight}`);
  }
  if (
    result.fontWeightBold !== undefined &&
    (result.fontWeightBold <= 0 || result.fontWeightBold > 1000)
  ) {
    throw Error(`Invalid font weight bold: ${result.fontWeightBold}`);
  }
  if (
    result.letterSpacing !== undefined &&
    (result.letterSpacing < 0 || result.letterSpacing > 2)
  ) {
    throw Error(`Invalid letter spacing: ${result.letterSpacing}`);
  }
  if (
    result.lineHeight !== undefined &&
    (result.lineHeight <= 0 || result.lineHeight > 4)
  ) {
    throw Error(`Invalid line height: ${result.lineHeight}`);
  }
  if (result.terminalContentPadding !== undefined) {
    if (
      result.terminalContentPadding.top < 0 ||
      result.terminalContentPadding.top > 128
    ) {
      throw Error(
        `Invalid terminal content padding top: ${result.terminalContentPadding.top}`,
      );
    }
    if (
      result.terminalContentPadding.right < 0 ||
      result.terminalContentPadding.right > 128
    ) {
      throw Error(
        `Invalid terminal content padding right: ${result.terminalContentPadding.right}`,
      );
    }
    if (
      result.terminalContentPadding.bottom < 0 ||
      result.terminalContentPadding.bottom > 128
    ) {
      throw Error(
        `Invalid terminal content padding bottom: ${result.terminalContentPadding.bottom}`,
      );
    }
    if (
      result.terminalContentPadding.left < 0 ||
      result.terminalContentPadding.left > 128
    ) {
      throw Error(
        `Invalid terminal content padding left: ${result.terminalContentPadding.left}`,
      );
    }
    if (
      result.terminalBorderWidth !== undefined &&
      (result.terminalBorderWidth < 0 || result.terminalBorderWidth > 128)
    ) {
      throw Error(
        `Invalid terminal border width: ${result.terminalBorderWidth}`,
      );
    }
  }
  if (
    (result.shells !== undefined || result.defaultShellName !== undefined) &&
    !(result.shells || []).find(
      (shell) => shell.name === result.defaultShellName,
    )
  ) {
    throw Error(
      `Could not find config for default shell: ${result.defaultShellName}`,
    );
  }

  return result;
};

const ResolvedConfigType = t.type(ConfigTypeContent);
export type ResolvedConfig = t.TypeOf<typeof ResolvedConfigType>;

export const resolveConfig = (
  config: unknown,
  platform: string | null = null,
): ResolvedConfig => {
  const validatedConfig = validateConfig(config);

  const resolvedConfig = {
    ..._.cloneDeep(DEFAULT_CONFIG),
    ...validatedConfig,
  };

  // acrylic is only supported on Mac
  if (resolvedConfig.acrylic && platform !== 'darwin') {
    resolvedConfig.acrylic = false;
  }

  if (resolvedConfig.acrylic) {
    resolvedConfig.colorScheme.background = '#00000000';
  }

  // resolve referenced color names
  if (
    resolvedConfig.terminalBorderColorActive &&
    (resolvedConfig.colorScheme as Record<string, string>)[
      resolvedConfig.terminalBorderColorActive
    ]
  ) {
    resolvedConfig.terminalBorderColorActive = (
      resolvedConfig.colorScheme as Record<string, string>
    )[resolvedConfig.terminalBorderColorActive];
  }
  if (
    resolvedConfig.terminalBorderColorInactive &&
    (resolvedConfig.colorScheme as Record<string, string>)[
      resolvedConfig.terminalBorderColorInactive
    ]
  ) {
    resolvedConfig.terminalBorderColorInactive = (
      resolvedConfig.colorScheme as Record<string, string>
    )[resolvedConfig.terminalBorderColorInactive];
  }

  return resolvedConfig;
};
