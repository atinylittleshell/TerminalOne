'use client';

import { useEffect } from 'react';

import { useConfigContext } from '../../hooks/ConfigContext';

const ShellSelector = ({
  onShellSelected,
}: {
  onShellSelected: (_shellName: string) => void;
}) => {
  const { config } = useConfigContext();

  const shellOptions = config.shells.map((shell, index) => {
    return {
      name: shell.name,
      index: index + 1,
    };
  });

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        const shellIndex = parseInt(e.key);
        const shell = shellOptions.find((s) => s.index === shellIndex);
        if (shell) {
          onShellSelected(shell.name);
        }
      }
    };

    window.addEventListener('keydown', keyHandler);

    return () => {
      window.removeEventListener('keydown', keyHandler);
    };
  }, [shellOptions, onShellSelected]);

  return (
    <div
      className="flex-1 w-full h-full absolute overflow-hidden flex flex-col"
      tabIndex={1}
    >
      <ul className="menu">
        {shellOptions.map((shell) => {
          return (
            <li key={shell.name}>
              <a onClick={() => onShellSelected(shell.name)}>
                {shell.index} - {shell.name}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ShellSelector;
