// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[macro_use]
extern crate lazy_static;

use tauri_plugin_log::LogTarget;

mod config;
mod handlers;
mod utils;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      handlers::app::is_acrylic_enabled,
      handlers::terminal::create_terminal_if_not_exist,
      handlers::terminal::resize_terminal,
      handlers::terminal::kill_terminal,
      handlers::terminal::write_to_terminal,
      handlers::config::get_config,
      handlers::config::get_config_path,
    ])
    .plugin(
      tauri_plugin_log::Builder::default()
        .targets([LogTarget::LogDir, LogTarget::Stdout])
        .build(),
    )
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .setup(|app| {
      use tauri::Manager;

      let _window = app.get_window("main").expect("main window not found");
      utils::acrylic::enable_acrylic_if_configured(&_window);
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
