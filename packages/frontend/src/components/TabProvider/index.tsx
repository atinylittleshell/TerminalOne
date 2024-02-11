import _ from 'lodash';
import {
  createContext,
  createEffect,
  onCleanup,
  ParentProps,
  useContext,
} from 'solid-js';
import { createStore } from 'solid-js/store';

import { TerminalTreeNodeData } from '../../types/terminal';
import { useKeybinds } from '../KeybindsProvider';

let nextTerminalId = 1;

const lookupTerminalById = (root: TerminalTreeNodeData, terminalId: string) => {
  const queue: TerminalTreeNodeData[] = [root];

  while (queue.length) {
    const node = queue.shift()!;
    if (node.nodeType === 'terminal') {
      if (node.terminalId === terminalId) {
        return node;
      }
    } else {
      queue.push(...node.children);
    }
  }

  return null;
};

const createCloseHandler = (
  root: TerminalTreeNodeData,
  setRoot: (root: TerminalTreeNodeData) => void,
  closeRoot: () => void,
) => {
  return (terminalId: string) => {
    const node = lookupTerminalById(root, terminalId);
    if (!node) {
      return;
    }

    const replaceTarget = node.parent;
    if (!replaceTarget) {
      closeRoot();
      return;
    }
    if (replaceTarget.nodeType === 'terminal') {
      throw new Error('terminal node being a parent is unexpected');
    }

    const survivingSibling =
      replaceTarget.children[0] === node
        ? replaceTarget.children[1]
        : replaceTarget.children[0];

    // replacing root with the surviving sibling
    if (replaceTarget.parent === null) {
      setRoot({
        ..._.cloneDeep(survivingSibling),
        parent: null,
      });
      return;
    }

    if (replaceTarget.parent.nodeType === 'terminal') {
      throw new Error('terminal node being a parent is unexpected');
    }

    const replaceIndex = replaceTarget.parent.children.indexOf(replaceTarget);
    if (replaceIndex === -1) {
      throw new Error('node not found in parent');
    }

    replaceTarget.parent.children[replaceIndex] = survivingSibling;
    survivingSibling.parent = replaceTarget.parent;

    setRoot(_.cloneDeep(root));
  };
};

const createSplitHandler = (
  root: TerminalTreeNodeData,
  setRoot: (root: TerminalTreeNodeData) => void,
  splitType: 'horizontal' | 'vertical',
) => {
  return (terminalId: string) => {
    const node = lookupTerminalById(root, terminalId);
    if (!node) {
      return;
    }

    const parent = node.parent;
    const newNode: TerminalTreeNodeData = {
      nodeType: 'split',
      parent,
      splitType,
      splitRatio: 0.5,
      children: [
        {
          nodeType: 'terminal',
          parent: null,
          terminalId,
          useDefaultShell: true,
        },
        {
          nodeType: 'terminal',
          parent: null,
          terminalId: (nextTerminalId++).toFixed(),
          useDefaultShell: false,
        },
      ],
    };
    newNode.children[0].parent = newNode;
    newNode.children[1].parent = newNode;

    if (parent) {
      if (parent.nodeType === 'terminal') {
        throw new Error('terminal node being a parent is unexpected');
      }

      const indexToReplace = parent.children.indexOf(node);
      if (indexToReplace === -1) {
        throw new Error('node not found in parent');
      }

      parent.children[indexToReplace] = newNode;

      setRoot(_.cloneDeep(root));
    } else {
      setRoot(newNode);
    }
  };
};

const findFirstTerminalId = (node: TerminalTreeNodeData): string | null => {
  if (node.nodeType === 'terminal') {
    return node.terminalId;
  }

  for (const child of node.children) {
    const result = findFirstTerminalId(child);
    if (result) {
      return result;
    }
  }

  return null;
};

const createFocusPaneHandler = (
  root: TerminalTreeNodeData,
  setActiveTerminalId: (terminalId: string | null) => void,
  direction: 'up' | 'down' | 'left' | 'right',
) => {
  return (terminalId: string) => {
    const node = lookupTerminalById(root, terminalId);
    if (!node) {
      setActiveTerminalId(findFirstTerminalId(root));
      return;
    }

    let current: TerminalTreeNodeData | null = node;
    while (current.parent) {
      if (current.parent.nodeType !== 'split') {
        throw new Error('unexpected node type');
      }

      switch (direction) {
        case 'up':
          if (
            current.parent.splitType === 'horizontal' &&
            current.parent.children[1] === current
          ) {
            setActiveTerminalId(
              findFirstTerminalId(current.parent.children[0]),
            );
            return;
          }
          break;
        case 'down':
          if (
            current.parent.splitType === 'horizontal' &&
            current.parent.children[0] === current
          ) {
            setActiveTerminalId(
              findFirstTerminalId(current.parent.children[1]),
            );
            return;
          }
          break;
        case 'left':
          if (
            current.parent.splitType === 'vertical' &&
            current.parent.children[1] === current
          ) {
            setActiveTerminalId(
              findFirstTerminalId(current.parent.children[0]),
            );
            return;
          }
          break;
        case 'right':
          if (
            current.parent.splitType === 'vertical' &&
            current.parent.children[0] === current
          ) {
            setActiveTerminalId(
              findFirstTerminalId(current.parent.children[1]),
            );
            return;
          }
          break;
      }

      current = current.parent;
    }

    setActiveTerminalId(findFirstTerminalId(root));
  };
};

interface TabContextData {
  root: TerminalTreeNodeData;
  activeTerminalId: string | null;
  lastActiveTerminalId: string | null;
}

type TabContext = {
  data: TabContextData;
  onTerminalActive: (terminalId: string | null) => void;
};

const TabContext = createContext<TabContext>({
  data: {
    root: {
      nodeType: 'terminal',
      parent: null,
      terminalId: '0',
      useDefaultShell: true,
    },
    activeTerminalId: null,
    lastActiveTerminalId: null,
  },
  onTerminalActive: () => {},
});

export const TabProvider = (
  props: ParentProps<{
    active: boolean;
    tabId: number;
    close: () => void;
  }>,
) => {
  const keybinds = useKeybinds();

  const [value, setValue] = createStore<TabContextData>({
    root: {
      nodeType: 'terminal',
      parent: null,
      terminalId: (nextTerminalId++).toFixed(),
      useDefaultShell: true,
    },
    activeTerminalId: null,
    lastActiveTerminalId: null,
  });

  createEffect(() => {
    if (props.active) {
      setValue('activeTerminalId', value.lastActiveTerminalId);
    } else {
      setValue('activeTerminalId', null);
    }
  });

  const setRoot = (newRoot: TerminalTreeNodeData) => {
    setValue('root', newRoot);
  };

  const onTerminalActive = (terminalId: string | null) => {
    setValue('lastActiveTerminalId', terminalId);
  };

  createEffect(() => {
    const splitVertical = createSplitHandler(value.root, setRoot, 'vertical');
    const splitHorizontal = createSplitHandler(
      value.root,
      setRoot,
      'horizontal',
    );

    const focusPaneUp = createFocusPaneHandler(
      value.root,
      onTerminalActive,
      'up',
    );
    const focusPaneDown = createFocusPaneHandler(
      value.root,
      onTerminalActive,
      'down',
    );
    const focusPaneLeft = createFocusPaneHandler(
      value.root,
      onTerminalActive,
      'left',
    );
    const focusPaneRight = createFocusPaneHandler(
      value.root,
      onTerminalActive,
      'right',
    );
    const closePane = createCloseHandler(value.root, setRoot, () => {
      props.close();
    });

    keybinds.commands.on('split_vertical', splitVertical);
    keybinds.commands.on('split_horizontal', splitHorizontal);

    keybinds.commands.on('focus_pane_up', focusPaneUp);
    keybinds.commands.on('focus_pane_down', focusPaneDown);
    keybinds.commands.on('focus_pane_left', focusPaneLeft);
    keybinds.commands.on('focus_pane_right', focusPaneRight);

    keybinds.commands.on('close_pane', closePane);

    onCleanup(() => {
      keybinds.commands.off('split_vertical', splitVertical);
      keybinds.commands.off('split_horizontal', splitHorizontal);

      keybinds.commands.off('focus_pane_up', focusPaneUp);
      keybinds.commands.off('focus_pane_down', focusPaneDown);
      keybinds.commands.off('focus_pane_left', focusPaneLeft);
      keybinds.commands.off('focus_pane_right', focusPaneRight);

      keybinds.commands.off('close_pane', closePane);
    });
  });

  return (
    <TabContext.Provider
      value={{
        data: value,
        onTerminalActive,
      }}
    >
      {props.children}
    </TabContext.Provider>
  );
};

export const useTab = () => {
  return useContext(TabContext);
};
