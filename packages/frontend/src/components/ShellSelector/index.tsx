import { createEffect, For, onCleanup } from 'solid-js';

import { useConfig } from '../ConfigProvider';

export const ShellSelector = (props: {
  onShellSelected: (_shellName: string) => void;
}) => {
  const config = useConfig();

  const shellOptions = config.data.shells.map((shell, index) => {
    return {
      name: shell.name,
      index: index + 1,
    };
  });

  createEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        const shellIndex = parseInt(e.key);
        const shell = shellOptions.find((s) => s.index === shellIndex);
        if (shell) {
          props.onShellSelected(shell.name);
        }
      }
    };

    window.addEventListener('keydown', keyHandler);

    onCleanup(() => {
      window.removeEventListener('keydown', keyHandler);
    });
  });

  return (
    <div
      class="flex-1 w-full h-full absolute overflow-hidden flex flex-col"
      tabIndex={1}
    >
      <ul class="menu">
        <For each={shellOptions}>
          {(shell) => {
            return (
              <li>
                <a onClick={() => props.onShellSelected(shell.name)}>
                  {shell.index} - {shell.name}
                </a>
              </li>
            );
          }}
        </For>
      </ul>
    </div>
  );
};
