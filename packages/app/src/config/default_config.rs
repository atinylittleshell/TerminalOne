use super::types::{
  ColorSchemeConfig, Config, CursorStyle, KeybindConfig, Padding, ShellConfig,
};

lazy_static! {
  pub static ref DEFAULT_CONFIG: Config = Config {
    // Whether to use acrylic effect on the window background. This is only supported on Mac and Win 11.
    acrylic: true,

    // Number of lines to keep in the scrollback buffer.
    scrollback: 10000,

    // Whether to copy text to the clipboard on selection.
    copy_on_select: true,

    // Whether to blink the cursor.
    cursor_blink: true,

    // Style of the cursor. Valid values are 'block', 'underline', and 'bar'.
    cursor_style: CursorStyle::Bar,

    // Width of the cursor in pixels.
    cursor_width: 1,

    // Font size in pixels.
    font_size: 16,

    // Font family. Follows css syntax.
    font_family: "Consolas, Menlo, monospace".to_string(),

    // Font weight for normal text. Valid values are 100-900 in multiples of 100.
    font_weight: 400,

    // Font weight for bold text. Valid values are 100-900 in multiples of 100.
    font_weight_bold: 700,

    // Letter spacing in pixels.
    letter_spacing: 1.0,

    // Line height relative to font size.
    line_height: 1.0,

    // Padding within each terminal in pixels.
    terminal_content_padding: Padding {
      top: 8,
      bottom: 8,
      left: 8,
      right: 8,
    },

    // Border width of each terminal in pixels.
    terminal_border_width: 1,

    // Border color of each terminal when it is active.
    terminal_border_color_active: "foreground".to_string(),

    // Border color of each terminal when it is inactive.
    terminal_border_color_inactive: "background".to_string(),

    // Configuration for the color scheme. Default is https://rosepinetheme.com/.
    color_scheme: ColorSchemeConfig {
      cursor: "#56526e".to_string(),
      cursor_accent: "#e0def4".to_string(),

      selection_background: "#312f44".to_string(),
      selection_foreground: "#e0def4".to_string(),
      selection_inactive_background: "#312f44".to_string(),

      background: "#232136".to_string(),
      foreground: "#e0def4".to_string(),

      black: "#393552".to_string(),
      blue: "#9ccfd8".to_string(),
      cyan: "#ea9a97".to_string(),
      green: "#3e8fb0".to_string(),
      magenta: "#c4a7e7".to_string(),
      red: "#eb6f92".to_string(),
      white: "#e0def4".to_string(),
      yellow: "#f6c177".to_string(),

      bright_black: "#817c9c".to_string(),
      bright_blue: "#9ccfd8".to_string(),
      bright_cyan: "#ea9a97".to_string(),
      bright_green: "#3e8fb0".to_string(),
      bright_magenta: "#c4a7e7".to_string(),
      bright_red: "#eb6f92".to_string(),
      bright_white: "#e0def4".to_string(),
      bright_yellow: "#f6c177".to_string(),
    },

    // Configuration for all shells to be used in the terminal.
    shells: vec![ShellConfig {
      name: "Default".to_string(),
      command: "".to_string(),
      startup_directory: "".to_string(),
    }],

    // Name of the default shell to use. This must match one of the names defined in "shells".
    default_shell_name: "Default".to_string(),

    // The leader key to be used to trigger multi-chord keybinds.
    // Pressing this keybind twice will "escape" the leader and send the key into the terminal.
    keybind_leader: "ctrl+b".to_string(),

    // Keybinds to use for the terminal.
    keybinds: KeybindConfig {
      create_tab: "leader c".to_string(),
      close_tab: "leader shift+&".to_string(),
      next_tab: "leader n".to_string(),
      previous_tab: "leader p".to_string(),
      tab1: "leader 1".to_string(),
      tab2: "leader 2".to_string(),
      tab3: "leader 3".to_string(),
      tab4: "leader 4".to_string(),
      tab5: "leader 5".to_string(),
      tab6: "leader 6".to_string(),
      tab7: "leader 7".to_string(),
      tab8: "leader 8".to_string(),
      tab9: "leader 9".to_string(),
      split_horizontal: "leader shift+%".to_string(),
      split_vertical: "leader shift+\"".to_string(),
      focus_pane_left: "leader h".to_string(),
      focus_pane_right: "leadedr l".to_string(),
      focus_pane_up: "leader k".to_string(),
      focus_pane_down: "leader j".to_string(),
      close_pane: "leader x".to_string(),
    },
  };
}
