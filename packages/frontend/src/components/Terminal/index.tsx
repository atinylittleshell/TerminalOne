import { createEffect, onCleanup } from 'solid-js';

import { useConfig } from '../ConfigProvider';
import { useTerminalsManager } from '../TerminalsManagerProvider';

export const Terminal = (props: { terminalId: string }) => {
  let containerRef: HTMLDivElement | undefined = undefined;
  const { config } = useConfig();
  const { getOrCreateTerminal } = useTerminalsManager();

  createEffect(() => {
    if (!containerRef) {
      return;
    }

    const { terminalDiv } = getOrCreateTerminal(props.terminalId, config);
    containerRef.appendChild(terminalDiv);
    terminalDiv.style.visibility = 'visible';

    onCleanup(() => {
      terminalDiv.style.visibility = 'hidden';
      document.body.appendChild(terminalDiv);
    });
  });

  return (
    <div
      class="w-full h-full relative overflow-hidden"
      ref={(el) => {
        containerRef = el;
      }}
    />
  );
};
