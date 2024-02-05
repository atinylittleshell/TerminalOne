import { Match, Switch } from 'solid-js';

import { useConfig } from './components/ConfigProvider';
import { SplashScreen } from './components/SplashScreen';
import { TabsBar } from './components/TabsBar';

export function App() {
  const configContext = useConfig();

  return (
    <Switch>
      <Match when={configContext.loading}>
        <SplashScreen />
      </Match>
      <Match when={!configContext.loading}>
        <div
          class="w-screen h-screen relative overflow-hidden flex flex-col"
          style={{
            'background-color': configContext.data.color_scheme.background,
            color: configContext.data.color_scheme.foreground,
            'font-family': configContext.data.font_family,
          }}
        >
          <TabsBar />
        </div>
      </Match>
    </Switch>
  );
}
