use crate::config::{self};
use std::sync::Mutex;
use tauri::Window;

lazy_static! {
  pub static ref ACRYLIC_ENABLED: Mutex<bool> = Mutex::new(false);
}

pub fn enable_acrylic_if_configured(_window: &Window) {
  let config = config::CONFIG.clone();
  if config.acrylic {
    #[cfg(target_os = "linux")]
    {
      log::warn!("Acrylic effect is not supported on Linux");
      *ACRYLIC_ENABLED.lock().unwrap() = false;
    }

    #[cfg(target_os = "windows")]
    {
      use tauri::{Runtime, Theme, WindowEvent};
      use window_vibrancy::apply_acrylic;

      fn apply_themed_acrylic<R: Runtime>(
        theme: &Theme,
        window: &Window<R>,
      ) -> bool {
        match theme {
          Theme::Light => {
            match apply_acrylic(window, Some((255, 255, 255, 125))) {
              Ok(_) => true,
              Err(e) => {
                log::error!("Failed to apply acrylic effect: {}", e);
                false
              }
            }
          }
          _ => match apply_acrylic(window, Some((0, 0, 0, 50))) {
            Ok(_) => true,
            Err(e) => {
              log::error!("Failed to apply acrylic effect: {}", e);
              false
            }
          },
        }
      }

      _window.on_window_event({
        let win = _window.clone();
        move |event| {
          if let WindowEvent::ThemeChanged(theme) = event {
            *ACRYLIC_ENABLED.lock().unwrap() =
              apply_themed_acrylic(theme, &win);
          }
        }
      });

      *ACRYLIC_ENABLED.lock().unwrap() =
        apply_themed_acrylic(&_window.theme().unwrap(), &_window);
    }

    #[cfg(target_os = "macos")]
    {
      use window_vibrancy::{
        apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState,
      };

      match apply_vibrancy(
        &_window,
        NSVisualEffectMaterial::UnderWindowBackground,
        Some(NSVisualEffectState::FollowsWindowActiveState),
        Some(8.0),
      ) {
        Ok(_) => *ACRYLIC_ENABLED.lock().unwrap() = true,
        Err(e) => {
          log::error!("Failed to apply acrylic effect: {}", e);
          *ACRYLIC_ENABLED.lock().unwrap() = false;
        }
      }
    }
  }
}
