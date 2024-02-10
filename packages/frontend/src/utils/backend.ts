import { invoke } from '@tauri-apps/api/tauri';

import { Config } from '../types/config';

export const createTerminalIfNotExist = async (
  terminalId: string,
  cols: number,
  rows: number,
  shellCommand: string,
  startupDirectory: string,
) => {
  await invoke('create_terminal_if_not_exist', {
    terminalId,
    cols,
    rows,
    shellCommand,
    startupDirectory,
  });
};

export const writeToTerminal = async (terminalId: string, data: string) => {
  await invoke('write_to_terminal', { terminalId, data });
};

export const resizeTerminal = async (
  terminalId: string,
  cols: number,
  rows: number,
) => {
  await invoke('resize_terminal', { terminalId, cols, rows });
};

export const killTerminal = async (terminalId: string) => {
  await invoke('kill_terminal', { terminalId });
};

export const getConfig = async (): Promise<Config> => {
  return await invoke('get_config');
};

export const getConfigPath = async (): Promise<string> => {
  return await invoke('get_config_path');
};

export const isAcrylicEnabled = async (): Promise<boolean> => {
  return await invoke('is_acrylic_enabled');
};

export const getLogDir = async (): Promise<string> => {
  return await invoke('get_log_dir');
};
