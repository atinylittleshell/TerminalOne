export type CursorStyle = 'block' | 'underline' | 'bar';

export type Padding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type ColorSchemeConfig = {
  foreground: string;
  background: string;
  cursor: string;
  cursor_accent: string;
  selection_background: string;
  selection_foreground: string;
  selection_inactive_background: string;
  black: string;
  white: string;
  red: string;
  green: string;
  blue: string;
  yellow: string;
  cyan: string;
  magenta: string;
  bright_black: string;
  bright_white: string;
  bright_red: string;
  bright_green: string;
  bright_blue: string;
  bright_yellow: string;
  bright_cyan: string;
  bright_magenta: string;
};

export type ShellConfig = {
  name: string;
  command: string;
  startup_directory: string;
};

export type KeybindConfig = {
  create_tab: string;
  close_tab: string;
  next_tab: string;
  previous_tab: string;
  tab1: string;
  tab2: string;
  tab3: string;
  tab4: string;
  tab5: string;
  tab6: string;
  tab7: string;
  tab8: string;
  tab9: string;
  split_horizontal: string;
  split_vertical: string;
  focus_pane_left: string;
  focus_pane_right: string;
  focus_pane_up: string;
  focus_pane_down: string;
  close_pane: string;
};

export type Config = {
  acrylic: boolean;
  cursor_blink: boolean;
  cursor_style: CursorStyle;
  cursor_width: number;
  scrollback: number;
  copy_on_select: boolean;
  font_size: number;
  font_family: string;
  font_weight: number;
  font_weight_bold: number;
  letter_spacing: number;
  line_height: number;
  terminal_content_padding: Padding;
  terminal_border_width: number;
  terminal_border_color_active: string;
  terminal_border_color_inactive: string;
  color_scheme: ColorSchemeConfig;
  shells: ShellConfig[];
  default_shell_name: string;
  keybind_leader: string;
  keybinds: KeybindConfig;
};
