extern crate dirs;

use std::{
  collections::HashMap,
  env,
  path::PathBuf,
  sync::{Arc, Mutex},
  thread,
};

use portable_pty::{
  native_pty_system, Child, ChildKiller, CommandBuilder, MasterPty, PtySize,
};

struct PTYInstance {
  id: String,
  pty: Arc<Mutex<Box<dyn MasterPty + Send>>>,
  writer: Arc<Mutex<Box<dyn std::io::Write + Send>>>,
  shell_process: Arc<Mutex<Box<dyn Child + Send + Sync>>>,
  shell_process_killer: Arc<Mutex<Box<dyn ChildKiller + Send + Sync>>>,
}

impl PTYInstance {
  fn new(
    id: &str,
    cols: u16,
    rows: u16,
    shell_command: &str,
    startup_directory: PathBuf,
  ) -> PTYInstance {
    let pty_system = native_pty_system();
    let pty_pair = pty_system
      .openpty(PtySize {
        rows,
        cols,
        pixel_width: 0,
        pixel_height: 0,
      })
      .expect("Failed to open pty");

    let mut cmd = CommandBuilder::new(shell_command);
    cmd.cwd(startup_directory);
    cmd.env_remove("APPIMAGE");
    cmd.env_remove("APPDIR");
    cmd.env_remove("OWD");
    cmd.env("TERM", "xterm-256color");
    cmd.env("COLORTERM", "truecolor");
    cmd.env("TERM_PROGRAM", "Terminal One");
    cmd.env("TERM_PROGRAM_VERSION", env!("CARGO_PKG_VERSION"));

    let child = pty_pair
      .slave
      .spawn_command(cmd)
      .expect("Failed to spawn pty");

    let child_killer = child.clone_killer();
    let writer = pty_pair
      .master
      .take_writer()
      .expect("Failed to create writer to pty");

    PTYInstance {
      id: id.to_string(),
      pty: Arc::new(Mutex::new(pty_pair.master)),
      writer: Arc::new(Mutex::new(writer)),
      shell_process: Arc::new(Mutex::new(child)),
      shell_process_killer: Arc::new(Mutex::new(child_killer)),
    }
  }

  fn start_read_thread(&mut self, window: tauri::Window) {
    let mut reader = self
      .pty
      .lock()
      .expect("Failed to lock pty")
      .try_clone_reader()
      .expect("Failed to create reader to pty");

    thread::spawn({
      let terminal_id = self.id.to_string();
      move || {
        let mut buffer = [0; 1024 * 1024];

        loop {
          match reader.read(&mut buffer) {
            Ok(bytes_read) if bytes_read == 0 => {
              // End of file or no data to read
              break;
            }
            Ok(bytes_read) => {
              // Process the data and send an event to the frontend
              window
                .emit(
                  "terminal_read",
                  serde_json::json!({
                    "terminal_id": terminal_id,
                    "data": String::from_utf8_lossy(&buffer[..bytes_read]).to_string(),
                  }),
                )
                .expect("Failed to emit event");
            }
            Err(e) => {
              // Handle errors here
              eprintln!("Error reading: {}", e);
              break;
            }
          }
        }
      }
    });
  }

  fn start_wait_thread(&mut self, window: tauri::Window) {
    thread::spawn({
      let terminal_id = self.id.to_string();
      let shell_process_ref = self.shell_process.clone();
      move || {
        let mut shell_process = shell_process_ref
          .lock()
          .expect("Failed to lock shell process");

        let status = shell_process
          .wait()
          .expect("Failed to wait on child process");

        window
          .emit(
            "terminal_exit",
            serde_json::json!({
              "terminal_id": terminal_id,
              "exit_code": status.exit_code(),
            }),
          )
          .expect("Failed to emit event");
      }
    });
  }

  fn resize(&mut self, cols: u16, rows: u16) {
    self
      .pty
      .lock()
      .expect("Failed to lock pty")
      .resize(PtySize {
        rows,
        cols,
        pixel_width: 0,
        pixel_height: 0,
      })
      .expect("Failed to resize pty");
  }

  fn kill(&mut self) {
    self
      .shell_process_killer
      .lock()
      .expect("Failed to lock shell process killer")
      .kill()
      .expect("Failed to kill pty");
  }

  fn write(&mut self, data: &str) {
    let mut writer =
      self.writer.lock().expect("Failed to create writer to pty");

    let bytes = data.as_bytes();
    writer.write_all(bytes).expect("Failed to write to pty");
  }
}

lazy_static! {
  static ref PTY_INSTANCES: Mutex<HashMap<String, PTYInstance>> = {
    let m = HashMap::new();
    Mutex::new(m)
  };
}

#[tauri::command]
pub fn create_terminal_if_not_exist(
  window: tauri::Window,
  terminal_id: String,
  cols: u16,
  rows: u16,
  shell_command: String,
  startup_directory: String,
) {
  let shell = if shell_command.is_empty() {
    if cfg!(windows) {
      env::var("COMSPEC").unwrap_or("cmd.exe".to_string())
    } else {
      env::var("SHELL").unwrap_or("/bin/bash".to_string())
    }
  } else {
    shell_command
  };
  let mut instances = PTY_INSTANCES.lock().unwrap();
  if !instances.contains_key(&terminal_id) {
    let mut instance = PTYInstance::new(
      &terminal_id,
      cols,
      rows,
      &shell,
      if startup_directory.is_empty() {
        dirs::home_dir().expect("Failed to get home directory")
      } else {
        PathBuf::from(startup_directory)
      },
    );

    instance.start_read_thread(window.clone());
    instance.start_wait_thread(window.clone());

    instances.insert(terminal_id, instance);
  }
}

#[tauri::command]
pub fn resize_terminal(terminal_id: String, cols: u16, rows: u16) {
  let mut instances = PTY_INSTANCES.lock().unwrap();
  if let Some(instance) = instances.get_mut(&terminal_id) {
    instance.resize(cols, rows);
  }
}

#[tauri::command]
pub fn kill_terminal(terminal_id: String) {
  let mut instances = PTY_INSTANCES.lock().unwrap();
  if let Some(instance) = instances.get_mut(&terminal_id) {
    instance.kill();
    instances.remove(&terminal_id);
  }
}

#[tauri::command]
pub fn write_to_terminal(terminal_id: String, data: String) {
  let mut instances = PTY_INSTANCES.lock().unwrap();
  if let Some(instance) = instances.get_mut(&terminal_id) {
    instance.write(&data);
  }
}
