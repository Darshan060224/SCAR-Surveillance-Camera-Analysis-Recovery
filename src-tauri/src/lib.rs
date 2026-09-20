use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct SystemDiagnostics {
    pub os: String,
    pub storage_valid: bool,
}

#[tauri::command]
fn check_system_diagnostics() -> SystemDiagnostics {
    SystemDiagnostics {
        os: std::env::consts::OS.to_string(),
        storage_valid: true,
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![check_system_diagnostics])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
