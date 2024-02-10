import { app, path } from '@tauri-apps/api';
import { open } from '@tauri-apps/api/shell';
import { createSignal, onMount } from 'solid-js';

import { useConfig } from '../ConfigProvider';

export const SettingsPage = () => {
  const config = useConfig();
  const [appVersion, setAppVersion] = createSignal<string>('0.0.0');
  const [configDir, setConfigDir] = createSignal<string>('');

  onMount(() => {
    app.getVersion().then((version) => {
      setAppVersion(version);
    });

    path.dirname(config.path).then((dir) => {
      setConfigDir(dir);
    });
  });

  return (
    <div
      class="flex-1 w-full h-full relative flex flex-col p-4"
      style={{
        'font-family': config.data.font_family,
        'font-size': `${config.data.font_size}px`,
        'font-weight': config.data.font_weight,
        'line-height': config.data.line_height,
        color: config.data.color_scheme.foreground,
        'background-color': config.data.color_scheme.background,
      }}
    >
      <div>TerminalOne v{appVersion()}</div>
      <div>&nbsp;</div>
      <div>
        <a
          href="#"
          class="link"
          onClick={() => {
            open(configDir());
          }}
        >
          {configDir()}
        </a>
      </div>
    </div>
  );
};
