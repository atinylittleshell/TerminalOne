import { FiMenu, FiPlus, FiX } from 'solid-icons/fi';
import { For } from 'solid-js';

import { useConfig } from '../ConfigProvider';
import { useTabsManager } from '../TabsManagerProvider';

export const TabsBar = () => {
  const config = useConfig();
  const tabsManager = useTabsManager();

  return (
    <div class="flex flex-row items-center p-1 gap-1">
      <For each={tabsManager.data.tabs}>
        {(tab) => (
          <div
            class="flex flex-row items-center rounded-md"
            style={{
              'background-color':
                tabsManager.data.activeTabId == tab.id
                  ? config.data.color_scheme.selection_background
                  : 'transparent',
            }}
          >
            <button
              class={`py-1 px-4 ${tabsManager.data.activeTabId === tab.id ? 'opacity-100' : 'opacity-50'} hover:opacity-100 flex-row items-center`}
              style={{
                'padding-right':
                  tabsManager.data.activeTabId === tab.id ? '8px' : undefined,
              }}
              onClick={() => {
                if (tabsManager.data.activeTabId === tab.id) {
                  return;
                }
                tabsManager.switchToTab(tab.id);
              }}
            >
              {tab.id}
            </button>
            {tab.id === tabsManager.data.activeTabId && (
              <button
                class="ml-2 mr-4 opacity-50 hover:opacity-100 text-sm"
                onClick={() => {
                  tabsManager.closeTab(tab.id);
                }}
              >
                <FiX />
              </button>
            )}
          </div>
        )}
      </For>
      <button
        class="py-1 px-4 opacity-50 hover:opacity-100"
        onClick={() => {
          tabsManager.createTab();
        }}
      >
        <FiPlus />
      </button>
      <div class="flex-grow" />
      <button
        class="p-1 opacity-50 hover:opacity-100"
        style={{
          'background-color':
            tabsManager.data.activeTabId === 0
              ? config.data.color_scheme.background
              : undefined,
        }}
        onClick={() => {
          tabsManager.switchToTab(0);
        }}
      >
        <FiMenu />
      </button>
    </div>
  );
};
