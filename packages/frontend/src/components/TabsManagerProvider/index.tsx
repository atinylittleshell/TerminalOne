import { process } from '@tauri-apps/api';
import _ from 'lodash';
import {
  createContext,
  createEffect,
  onCleanup,
  ParentProps,
  useContext,
} from 'solid-js';
import { createStore } from 'solid-js/store';

import { useConfig } from '../ConfigProvider';
import { useKeybinds } from '../KeybindsProvider';

type UserTab = {
  id: number;
  shellName: string | null;
};

type TabsManagerContextStore = {
  tabs: UserTab[];
  activeTabId: number;
};

type TabsManagerContextData = {
  data: TabsManagerContextStore;
  createTab: () => void;
  closeTab: (id: number) => void;
  switchToTab: (id: number) => void;
};

const TabsManagerContext = createContext<TabsManagerContextData>({
  data: {
    tabs: [],
    activeTabId: 0,
  },
  createTab: () => {},
  closeTab: () => {},
  switchToTab: () => {},
});

export const TabsManagerProvider = (props: ParentProps) => {
  const config = useConfig();
  const keybinds = useKeybinds();

  const [store, setStore] = createStore<TabsManagerContextStore>({
    tabs: [],
    activeTabId: 0,
  });

  const createTab = () => {
    let newTabId = (_.max(store.tabs.map((t) => t.id)) || 0) + 1;
    for (let i = 0; i < store.tabs.length - 1; i++) {
      if (store.tabs[i + 1].id > store.tabs[i].id + 1) {
        newTabId = store.tabs[i].id + 1;
        break;
      }
    }
    setStore({
      tabs: [
        ...store.tabs,
        {
          id: newTabId,
          shellName:
            // the very first tab always use default shell
            // also use default shell if there is only one shell configured
            store.tabs.length === 0 || config.data.shells.length === 1
              ? config.data.default_shell_name
              : null,
        },
      ].sort((a, b) => a.id - b.id),
      activeTabId: newTabId,
    });
  };

  const closeTab = (id: number) => {
    const newTabs = store.tabs.filter((t) => t.id !== id);
    if (newTabs.length === 0) {
      process.exit(0);
    } else {
      setStore({
        tabs: newTabs,
        activeTabId: _.max(newTabs.map((t) => t.id)) || 0,
      });
    }
  };

  const closeCurrentTab = () => {
    closeTab(store.activeTabId);
  };

  const nextTab = () => {
    const currentTabIndex = store.tabs.findIndex(
      (tab) => tab.id === store.activeTabId,
    );
    if (currentTabIndex === -1) {
      return;
    }
    let nextTabIndex = currentTabIndex + 1;
    if (nextTabIndex >= store.tabs.length) {
      nextTabIndex = 0;
    }

    const nextTabId = store.tabs[nextTabIndex].id;
    setStore({ activeTabId: nextTabId });
  };

  const previousTab = () => {
    const currentTabIndex = store.tabs.findIndex(
      (tab) => tab.id === store.activeTabId,
    );
    if (currentTabIndex === -1) {
      return;
    }
    let previousTabIndex = currentTabIndex - 1;
    if (previousTabIndex < 0) {
      previousTabIndex = store.tabs.length - 1;
    }

    const previousTabId = store.tabs[previousTabIndex].id;
    setStore({ activeTabId: previousTabId });
  };

  const switchToTab = (id: number) => {
    if (id === store.activeTabId) {
      return;
    }

    if (id === 0) {
      setStore({ activeTabId: id });
      return;
    }

    if (store.tabs.some((t) => t.id === id)) {
      setStore({ activeTabId: id });
    }
  };

  const switchToTab1 = () => {
    switchToTab(1);
  };
  const switchToTab2 = () => {
    switchToTab(2);
  };
  const switchToTab3 = () => {
    switchToTab(3);
  };
  const switchToTab4 = () => {
    switchToTab(4);
  };
  const switchToTab5 = () => {
    switchToTab(5);
  };
  const switchToTab6 = () => {
    switchToTab(6);
  };
  const switchToTab7 = () => {
    switchToTab(7);
  };
  const switchToTab8 = () => {
    switchToTab(8);
  };
  const switchToTab9 = () => {
    switchToTab(9);
  };

  createEffect(() => {
    keybinds.commands.on('create_tab', createTab);
    keybinds.commands.on('close_tab', closeCurrentTab);
    keybinds.commands.on('next_tab', nextTab);
    keybinds.commands.on('previous_tab', previousTab);
    keybinds.commands.on('tab1', switchToTab1);
    keybinds.commands.on('tab2', switchToTab2);
    keybinds.commands.on('tab3', switchToTab3);
    keybinds.commands.on('tab4', switchToTab4);
    keybinds.commands.on('tab5', switchToTab5);
    keybinds.commands.on('tab6', switchToTab6);
    keybinds.commands.on('tab7', switchToTab7);
    keybinds.commands.on('tab8', switchToTab8);
    keybinds.commands.on('tab9', switchToTab9);

    onCleanup(() => {
      keybinds.commands.off('create_tab', createTab);
      keybinds.commands.off('close_tab', closeCurrentTab);
      keybinds.commands.off('next_tab', nextTab);
      keybinds.commands.off('previous_tab', previousTab);
      keybinds.commands.off('tab1', switchToTab1);
      keybinds.commands.off('tab2', switchToTab2);
      keybinds.commands.off('tab3', switchToTab3);
      keybinds.commands.off('tab4', switchToTab4);
      keybinds.commands.off('tab5', switchToTab5);
      keybinds.commands.off('tab6', switchToTab6);
      keybinds.commands.off('tab7', switchToTab7);
      keybinds.commands.off('tab8', switchToTab8);
      keybinds.commands.off('tab9', switchToTab9);
    });
  });

  createEffect(() => {
    if (!config.loading && store.tabs.length === 0) {
      createTab();
    }
  });

  return (
    <TabsManagerContext.Provider
      value={{
        data: store,
        createTab,
        closeTab,
        switchToTab,
      }}
    >
      {props.children}
    </TabsManagerContext.Provider>
  );
};

export const useTabsManager = () => {
  return useContext(TabsManagerContext);
};
