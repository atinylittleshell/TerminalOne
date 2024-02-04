import { Config } from '../../types/config';
import { isAcrylicEnabled } from '../../utils/backend';

export const validateConfig = (config: Config): Config => {
  if (config.scrollback !== undefined && config.scrollback < 0) {
    throw new Error(`Invalid scrollback value: ${config.scrollback}`);
  }
  if (
    config.font_size !== undefined &&
    (config.font_size <= 0 || config.font_size > 128)
  ) {
    throw new Error(`Invalid font size: ${config.font_size}`);
  }
  if (
    config.font_weight !== undefined &&
    (config.font_weight <= 0 || config.font_weight > 1000)
  ) {
    throw new Error(`Invalid font weight: ${config.font_weight}`);
  }
  if (
    config.font_weight_bold !== undefined &&
    (config.font_weight_bold <= 0 || config.font_weight_bold > 1000)
  ) {
    throw new Error(`Invalid font weight bold: ${config.font_weight_bold}`);
  }
  if (
    config.letter_spacing !== undefined &&
    (config.letter_spacing < 0 || config.letter_spacing > 2)
  ) {
    throw new Error(`Invalid letter spacing: ${config.letter_spacing}`);
  }
  if (
    config.line_height !== undefined &&
    (config.line_height <= 0 || config.line_height > 4)
  ) {
    throw new Error(`Invalid line height: ${config.line_height}`);
  }
  if (config.terminal_content_padding !== undefined) {
    if (
      config.terminal_content_padding.top < 0 ||
      config.terminal_content_padding.top > 128
    ) {
      throw new Error(
        `Invalid terminal content padding top: ${config.terminal_content_padding.top}`,
      );
    }
    if (
      config.terminal_content_padding.right < 0 ||
      config.terminal_content_padding.right > 128
    ) {
      throw new Error(
        `Invalid terminal content padding right: ${config.terminal_content_padding.right}`,
      );
    }
    if (
      config.terminal_content_padding.bottom < 0 ||
      config.terminal_content_padding.bottom > 128
    ) {
      throw new Error(
        `Invalid terminal content padding bottom: ${config.terminal_content_padding.bottom}`,
      );
    }
    if (
      config.terminal_content_padding.left < 0 ||
      config.terminal_content_padding.left > 128
    ) {
      throw new Error(
        `Invalid terminal content padding left: ${config.terminal_content_padding.left}`,
      );
    }
    if (
      config.terminal_border_width !== undefined &&
      (config.terminal_border_width < 0 || config.terminal_border_width > 128)
    ) {
      throw new Error(
        `Invalid terminal border width: ${config.terminal_border_width}`,
      );
    }
  }

  if (
    (config.shells !== undefined || config.default_shell_name !== undefined) &&
    !(config.shells || []).find(
      (shell) => shell.name === config.default_shell_name,
    )
  ) {
    throw new Error(
      `Could not find config for default shell: ${config.default_shell_name}`,
    );
  }

  return config;
};

export const resolveConfig = async (config: Config): Promise<Config> => {
  const resolvedConfig = validateConfig(config);
  const acrylicEnabled = await isAcrylicEnabled();

  if (acrylicEnabled) {
    resolvedConfig.color_scheme.background = '#00000000';
  }

  // resolve referenced color names
  if (
    resolvedConfig.terminal_border_color_active &&
    (resolvedConfig.color_scheme as Record<string, string>)[
      resolvedConfig.terminal_border_color_active
    ]
  ) {
    resolvedConfig.terminal_border_color_active = (
      resolvedConfig.color_scheme as Record<string, string>
    )[resolvedConfig.terminal_border_color_active];
  }
  if (
    resolvedConfig.terminal_border_color_inactive &&
    (resolvedConfig.color_scheme as Record<string, string>)[
      resolvedConfig.terminal_border_color_inactive
    ]
  ) {
    resolvedConfig.terminal_border_color_inactive = (
      resolvedConfig.color_scheme as Record<string, string>
    )[resolvedConfig.terminal_border_color_inactive];
  }

  return resolvedConfig;
};
