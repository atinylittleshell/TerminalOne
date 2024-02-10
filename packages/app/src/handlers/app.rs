use crate::utils::acrylic::ACRYLIC_ENABLED;

#[tauri::command]
pub fn is_acrylic_enabled() -> bool {
  *ACRYLIC_ENABLED.lock().unwrap()
}

#[tauri::command]
pub fn get_log_dir(app_handle: tauri::AppHandle) -> String {
  let path = app_handle.path_resolver().app_log_dir().unwrap();
  path.to_str().unwrap().to_string()
}
