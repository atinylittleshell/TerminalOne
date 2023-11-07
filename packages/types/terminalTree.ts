export type TerminalTreeNodeData = {
  parent: TerminalTreeNodeData | null;
} & (
  | {
      nodeType: 'terminal';
      terminalId: string;
      useDefaultShell: boolean;
    }
  | {
      nodeType: 'split';
      splitType: 'horizontal' | 'vertical';
      splitRatio: number;
      children: [TerminalTreeNodeData, TerminalTreeNodeData];
    }
);
