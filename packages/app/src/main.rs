// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[macro_use]
extern crate lazy_static;

use tauri_plugin_log::LogTarget;

mod config;
mod handlers;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      handlers::terminal::create_terminal_if_not_exist,
      handlers::terminal::resize_terminal,
      handlers::terminal::kill_terminal,
      handlers::terminal::write_to_terminal,
      handlers::config::get_config,
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

      let config = config::CONFIG.clone();
      if config.acrylic {
        #[cfg(target_os = "linux")]
        {
          log::warn!("Acrylic effect is not supported on Linux");
        }

        #[cfg(target_os = "windows")]
        {
          use tauri::{Runtime, Theme, Window, WindowEvent};
          use window_vibrancy::apply_acrylic;

          fn apply_themed_acrylic<R: Runtime>(
            theme: &Theme,
            window: &Window<R>,
          ) {
            match theme {
              Theme::Light => apply_acrylic(window, Some((255, 255, 255, 125)))
                .expect("Failed to apply acrylic effect"),
              _ => apply_acrylic(window, Some((0, 0, 0, 50)))
                .expect("Failed to apply acrylic effect"),
            }
          }

          _window.on_window_event({
            let win = _window.clone();
            move |event| {
              if let WindowEvent::ThemeChanged(theme) = event {
                apply_themed_acrylic(theme, &win)
              }
            }
          });

          apply_themed_acrylic(&_window.theme().unwrap(), &_window);
        }

        #[cfg(target_os = "macos")]
        {
          use window_vibrancy::{
            apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState,
          };

          apply_vibrancy(
            &_window,
            NSVisualEffectMaterial::UnderWindowBackground,
            Some(NSVisualEffectState::FollowsWindowActiveState),
            Some(8.0),
          )
          .expect("failed to apply acrylic effect");
        }
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
