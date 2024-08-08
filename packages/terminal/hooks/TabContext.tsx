'use client';

import { TerminalTreeNodeData } from '@terminalone/types';
import _ from 'lodash';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useKeybindContext } from './KeybindContext';

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

const createRenameHandler = (
  tabNames: { [key: number]: string },
  setTabNames: (tabNames: { [key: number]: string }) => void,
) => {
  return (tabId: number, newName: string) => {
    setTabNames({
      ...tabNames,
      [tabId]: newName,
    });
  };
};

interface TabContextData {
  root: TerminalTreeNodeData;
  activeTerminalId: string | null;
  onTerminalActive: (id: string | null) => void;
  onTerminalCreated: (id: string) => void;
  renameTab: (tabId: number, newName: string) => void;
}

const TabContext = createContext<TabContextData>({
  root: {
    nodeType: 'terminal',
    parent: null,
    terminalId: '0',
    useDefaultShell: true,
  },
  activeTerminalId: null,
  onTerminalActive: () => {
    return;
  },
  onTerminalCreated: () => {
    return;
  },
  renameTab: () => {
    return;
  },
});

export const TabContextProvider = (
  props: React.PropsWithChildren<{
    active: boolean;
    tabId: number;
    close: () => void;
  }>,
) => {
  const { commands } = useKeybindContext();
  const [root, setRoot] = useState<TerminalTreeNodeData>({
    nodeType: 'terminal',
    parent: null,
    terminalId: (nextTerminalId++).toFixed(),
    useDefaultShell: props.tabId === 1,
  });

  const [lastActiveTerminalId, setLastActiveTerminalId] = useState<
    string | null
  >(null);

  const activeTerminalId = useMemo(
    () => (props.active ? lastActiveTerminalId : null),
    [props.active, lastActiveTerminalId],
  );
  const onTerminalActive = useCallback((id: string | null) => {
    setLastActiveTerminalId(id);
  }, []);
  const onTerminalCreated = useCallback((id: string) => {
    setLastActiveTerminalId(id);
  }, []);

  const [tabNames, setTabNames] = useState<{ [key: number]: string }>({});
  const renameTab = useCallback(
    createRenameHandler(tabNames, setTabNames),
    [tabNames],
  );

  useEffect(() => {
    const splitVertical = createSplitHandler(root, setRoot, 'vertical');
    const splitHorizontal = createSplitHandler(root, setRoot, 'horizontal');

    const focusPaneUp = createFocusPaneHandler(root, onTerminalActive, 'up');
    const focusPaneDown = createFocusPaneHandler(
      root,
      onTerminalActive,
      'down',
    );
    const focusPaneLeft = createFocusPaneHandler(
      root,
      onTerminalActive,
      'left',
    );
    const focusPaneRight = createFocusPaneHandler(
      root,
      onTerminalActive,
      'right',
    );
    const closePane = createCloseHandler(root, setRoot, () => {
      props.close();
    });

    commands.on('splitVertical', splitVertical);
    commands.on('splitHorizontal', splitHorizontal);

    commands.on('focusPaneUp', focusPaneUp);
    commands.on('focusPaneDown', focusPaneDown);
    commands.on('focusPaneLeft', focusPaneLeft);
    commands.on('focusPaneRight', focusPaneRight);

    commands.on('closePane', closePane);

    return () => {
      commands.off('splitVertical', splitVertical);
      commands.off('splitHorizontal', splitHorizontal);

      commands.off('focusPaneUp', focusPaneUp);
      commands.off('focusPaneDown', focusPaneDown);
      commands.off('focusPaneLeft', focusPaneLeft);
      commands.off('focusPaneRight', focusPaneRight);

      commands.off('closePane', closePane);
    };
  }, [commands, onTerminalActive, root, props]);

  return (
    <TabContext.Provider
      value={{
        root,
        activeTerminalId,
        onTerminalActive,
        onTerminalCreated,
        renameTab,
      }}
    >
      {props.children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  return useContext(TabContext);
};
