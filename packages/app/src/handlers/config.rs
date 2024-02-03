use crate::config::{types::Config, CONFIG, CONFIG_PATH};

#[tauri::command]
pub fn get_config() -> Config {
  CONFIG.clone()
}

#[tauri::command]
pub fn get_config_path() -> Result<String, String> {
  match CONFIG_PATH.clone().to_str() {
    Some(path_str) => Ok(path_str.to_string()),
    None => Err("Failed to convert path to string".into()),
  }
}
