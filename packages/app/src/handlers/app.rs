use crate::utils::acrylic::ACRYLIC_ENABLED;

#[tauri::command]
pub fn is_acrylic_enabled() -> bool {
  *ACRYLIC_ENABLED.lock().unwrap()
}
