use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum CursorStyle {
  #[serde(rename = "block")]
  Block,
  #[serde(rename = "underline")]
  Underline,
  #[serde(rename = "bar")]
  Bar,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Padding {
  pub top: u16,
  pub right: u16,
  pub bottom: u16,
  pub left: u16,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ColorSchemeConfig {
  pub foreground: String,
  pub background: String,
  pub cursor: String,
  pub cursor_accent: String,
  pub selection_background: String,
  pub selection_foreground: String,
  pub selection_inactive_background: String,
  pub black: String,
  pub white: String,
  pub red: String,
  pub green: String,
  pub blue: String,
  pub yellow: String,
  pub cyan: String,
  pub magenta: String,
  pub bright_black: String,
  pub bright_white: String,
  pub bright_red: String,
  pub bright_green: String,
  pub bright_blue: String,
  pub bright_yellow: String,
  pub bright_cyan: String,
  pub bright_magenta: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ShellConfig {
  pub name: String,
  pub command: String,
  pub startup_directory: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct KeybindConfig {
  pub create_tab: String,
  pub close_tab: String,
  pub next_tab: String,
  pub previous_tab: String,
  pub tab1: String,
  pub tab2: String,
  pub tab3: String,
  pub tab4: String,
  pub tab5: String,
  pub tab6: String,
  pub tab7: String,
  pub tab8: String,
  pub tab9: String,
  pub split_horizontal: String,
  pub split_vertical: String,
  pub focus_pane_left: String,
  pub focus_pane_right: String,
  pub focus_pane_up: String,
  pub focus_pane_down: String,
  pub close_pane: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Config {
  pub acrylic: bool,
  pub cursor_blink: bool,
  pub cursor_style: CursorStyle,
  pub cursor_width: u8,
  pub scrollback: u32,
  pub copy_on_select: bool,
  pub font_size: u8,
  pub font_family: String,
  pub font_weight: u16,
  pub font_weight_bold: u16,
  pub letter_spacing: f32,
  pub line_height: f32,
  pub terminal_content_padding: Padding,
  pub terminal_border_width: u8,
  pub terminal_border_color_active: String,
  pub terminal_border_color_inactive: String,
  pub color_scheme: ColorSchemeConfig,
  pub shells: Vec<ShellConfig>,
  pub default_shell_name: String,
  pub keybind_leader: String,
  pub keybinds: KeybindConfig,
}
