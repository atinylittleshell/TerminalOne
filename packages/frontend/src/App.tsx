import { For, Match, Switch } from 'solid-js';

import { useConfig } from './components/ConfigProvider';
import { SettingsPage } from './components/SettingsPage';
import { SplashScreen } from './components/SplashScreen';
import { Tab } from './components/Tab';
import { TabsBar } from './components/TabsBar';
import { useTabsManager } from './components/TabsManagerProvider';

export function App() {
  const config = useConfig();
  const tabsManager = useTabsManager();

  return (
    <Switch>
      <Match when={config.loading}>
        <SplashScreen />
      </Match>
      <Match when={!config.loading}>
        <div
          class="w-screen h-screen relative overflow-hidden flex flex-col"
          style={{
            'background-color': config.data.color_scheme.background,
            color: config.data.color_scheme.foreground,
            'font-family': config.data.font_family,
          }}
        >
          <TabsBar />
          <div class="flex-1 relative overflow-hidden">
            <Switch>
              <Match when={!tabsManager.data.activeTabId}>
                <SettingsPage />
              </Match>
            </Switch>
            <For each={tabsManager.data.tabs}>
              {(tab) => (
                <Tab
                  tabId={tab.id}
                  active={tabsManager.data.activeTabId === tab.id}
                  close={() => {
                    tabsManager.closeTab(tab.id);
                  }}
                />
              )}
            </For>
          </div>
        </div>
      </Match>
    </Switch>
  );
}
