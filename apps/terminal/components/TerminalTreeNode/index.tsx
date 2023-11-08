import { TerminalTreeNodeData } from '@terminalone/types';

import { useTabContext } from '../../hooks/TabContext';
import Terminal from '../Terminal';

export const TerminalTreeNode = ({
  data,
}: {
  data: TerminalTreeNodeData | null;
}) => {
  const { root } = useTabContext();

  const node = data ?? root;

  if (node.nodeType === 'terminal') {
    return (
      <Terminal
        terminalId={node.terminalId}
        useDefaultShell={node.useDefaultShell}
      />
    );
  }

  return (
    <div
      className={`w-full h-full relative flex ${
        node.splitType === 'horizontal' ? 'flex-col' : 'flex-row'
      } items-stretch`}
    >
      <div
        className="relative"
        style={
          node.splitType === 'vertical'
            ? {
                width: (node.splitRatio * 100).toFixed(2) + '%',
              }
            : {
                height: (node.splitRatio * 100).toFixed(2) + '%',
              }
        }
      >
        <TerminalTreeNode data={node.children[0]} />
      </div>
      <div
        className="relative"
        style={
          node.splitType === 'vertical'
            ? {
                width: ((1 - node.splitRatio) * 100).toFixed(2) + '%',
              }
            : {
                height: ((1 - node.splitRatio) * 100).toFixed(2) + '%',
              }
        }
      >
        <TerminalTreeNode data={node.children[1]} />
      </div>
    </div>
  );
};
