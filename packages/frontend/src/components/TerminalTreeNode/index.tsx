import { createMemo, Match, Switch } from 'solid-js';

import { TerminalTreeNodeData } from '../../types/terminal';
import { useTab } from '../TabProvider';
import { Terminal } from '../Terminal';

export const TerminalTreeNode = (props: {
  data: TerminalTreeNodeData | null;
}) => {
  const tab = useTab();

  const node = createMemo(() => props.data ?? tab.data.root);
  const terminalId = createMemo(() => {
    const n = node();
    if (n.nodeType === 'terminal') {
      return n.terminalId;
    }
    return null;
  });
  const useDefaultShell = createMemo(() => {
    const n = node();
    if (n.nodeType === 'terminal') {
      return n.useDefaultShell;
    }
    return false;
  });
  const splitType = createMemo(() => {
    const n = node();
    if (n.nodeType === 'split') {
      return n.splitType;
    }
    return null;
  });
  const splitRatio = createMemo(() => {
    const n = node();
    if (n.nodeType === 'split') {
      return n.splitRatio;
    }
    return null;
  });
  const children = createMemo(() => {
    const n = node();
    if (n.nodeType === 'split') {
      return n.children;
    }
    return null;
  });

  return (
    <Switch>
      <Match when={node().nodeType === 'terminal'}>
        <Terminal
          terminalId={terminalId()!}
          useDefaultShell={useDefaultShell()!}
        />
      </Match>
      <Match when={node().nodeType === 'split'}>
        <div
          class={`w-full h-full relative flex ${
            splitType() === 'horizontal' ? 'flex-col' : 'flex-row'
          } items-stretch`}
        >
          <div
            class="relative"
            style={
              splitType() === 'vertical'
                ? {
                    width: (splitRatio()! * 100).toFixed(2) + '%',
                  }
                : {
                    height: (splitRatio()! * 100).toFixed(2) + '%',
                  }
            }
          >
            <TerminalTreeNode data={children()![0]} />
          </div>
          <div
            class="relative"
            style={
              splitType() === 'vertical'
                ? {
                    width: ((1 - splitRatio()!) * 100).toFixed(2) + '%',
                  }
                : {
                    height: ((1 - splitRatio()!) * 100).toFixed(2) + '%',
                  }
            }
          >
            <TerminalTreeNode data={children()![1]} />
          </div>
        </div>
      </Match>
    </Switch>
  );
};
