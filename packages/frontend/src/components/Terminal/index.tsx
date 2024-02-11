import { createEffect, createSignal, onCleanup } from 'solid-js';
import { Terminal as XTerm } from 'xterm';

import { useConfig } from '../ConfigProvider';
import { useKeybinds } from '../KeybindsProvider';
import { useTab } from '../TabProvider';
import { useTerminalsManager } from '../TerminalsManagerProvider';

export const Terminal = (props: {
  terminalId: string;
  useDefaultShell: boolean;
}) => {
  let containerRef: HTMLDivElement | undefined = undefined;
  let terminalRef: XTerm | undefined = undefined;

  const keybinds = useKeybinds();
  const config = useConfig();
  const terminals = useTerminalsManager();
  const tab = useTab();

  const [shellName, setShellName] = createSignal<string | null>(null);

  createEffect(() => {
    if (!props.terminalId) {
      return;
    }

    if (props.useDefaultShell) {
      setShellName(config.data.default_shell_name);
    } else if (config.data.shells.length === 1) {
      setShellName(config.data.shells[0].name);
    } else {
      setShellName(null);
    }
  });

  createEffect(() => {
    const shell = shellName();
    if (!shell) {
      if (shell === null) {
        tab.onTerminalActive(null);
      }
      return;
    }
    if (!containerRef) {
      return;
    }

    const { terminal, terminalDiv, events } = terminals.getOrCreateTerminal(
      props.terminalId,
      config.data,
      shell,
      keybinds.handleKey,
    );
    containerRef.appendChild(terminalDiv);
    terminalDiv.style.visibility = 'visible';

    terminalRef = terminal;

    const onActive = () => {
      tab.onTerminalActive(props.terminalId);
    };
    events.on('active', onActive);

    onCleanup(() => {
      events.off('active', onActive);
      terminalDiv.style.visibility = 'hidden';
      document.body.appendChild(terminalDiv);
    });
  });

  createEffect(() => {
    if (tab.data.activeTerminalId === props.terminalId) {
      terminalRef?.focus();
      console.log('focus');
    } else {
      terminalRef?.blur();
      console.log('blur');
    }
  });

  return (
    <div
      class="w-full h-full relative overflow-hidden"
      style={{
        'padding-top': `${config.data.terminal_content_padding.top}px`,
        'padding-right': `${config.data.terminal_content_padding.right}px`,
        'padding-bottom': `${config.data.terminal_content_padding.bottom}px`,
        'padding-left': `${config.data.terminal_content_padding.left}px`,
        'border-width': `${config.data.terminal_border_width}px`,
        'border-color':
          // show active border when the terminal is active but is not root.
          // or when it's on shell selector
          (props.terminalId === tab.data.activeTerminalId ||
            shellName() === null) &&
          (tab.data.root.nodeType !== 'terminal' ||
            tab.data.root.terminalId !== props.terminalId)
            ? config.data.terminal_border_color_active
            : config.data.terminal_border_color_inactive,
      }}
      ref={(el) => {
        containerRef = el;
      }}
    />
  );
};
