use mlua::prelude::*;

mod default_config;
pub mod types;

fn apply_user_config(
  user_config_content: &str,
) -> Result<types::Config, String> {
  let lua = Lua::new();
  let default_config = default_config::DEFAULT_CONFIG.clone();

  lua
    .globals()
    .set(
      "config",
      lua
        .to_value(&default_config)
        .map_err(|e| format!("Failed to serialize default config: {}", e))?,
    )
    .map_err(|e| format!("Failed to set default config: {}", e))?;

  lua
    .load(user_config_content)
    .set_name("user_config")
    .exec()
    .map_err(|e| format!("Failed to execute user config script: {}", e))?;

  let config: types::Config = lua
    .from_value(
      lua
        .globals()
        .get("config")
        .map_err(|e| format!("Failed to get config: {}", e))?,
    )
    .map_err(|e| format!("Failed to deserialize config: {}", e))?;

  log::debug!("Applied user config: {:#?}", config);

  Ok(config)
}

fn get_config_path() -> std::path::PathBuf {
  let config_path_candidates = vec![
    dirs::home_dir()
      .unwrap()
      .join(".config")
      .join("TerminalOne")
      .join("config.lua"),
    dirs::config_dir()
      .unwrap()
      .join("TerminalOne")
      .join("config.lua"),
  ];

  config_path_candidates
    .iter()
    .find(|path| path.exists())
    .unwrap_or(&config_path_candidates[0])
    .to_path_buf()
}

fn load_config() -> Result<types::Config, String> {
  let config_path = CONFIG_PATH.to_str().unwrap();
  log::info!("Loading config from {:?}", config_path);

  let config_dir = CONFIG_PATH.parent().unwrap();
  if !config_dir.exists() {
    log::info!("Creating config directory: {:?}", config_dir);
    std::fs::create_dir_all(config_dir).unwrap();
  }

  if !CONFIG_PATH.exists() {
    log::info!("Creating default config: {:?}", config_path);
    std::fs::write(config_path, "").unwrap();
  }

  let user_config_content =
    std::fs::read_to_string(config_path).unwrap_or("".to_string());
  log::debug!("User config content: {}", user_config_content);

  Ok(apply_user_config(&user_config_content)?)
}

lazy_static! {
  pub static ref CONFIG_PATH: std::path::PathBuf = get_config_path();
  pub static ref CONFIG: types::Config = load_config().unwrap();
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_apply_user_config() {
    let user_config_content = r##"
      config.font_family = "Fira Code"
      config.font_size = 14
      config.color_scheme.background = "#000001"
    "##;

    let config = apply_user_config(user_config_content).unwrap();

    assert_eq!(config.scrollback, 10000);
    assert_eq!(config.font_family, "Fira Code");
    assert_eq!(config.font_size, 14);
    assert_eq!(config.color_scheme.background, "#000001");
  }
}
