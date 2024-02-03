use crate::config::{types::Config, CONFIG};

#[tauri::command]
pub fn get_config() -> Config {
  CONFIG.clone()
}
