import './index.css';
import 'xterm/css/xterm.css';

import { render } from 'solid-js/web';

import { App } from './App';
import { ConfigProvider } from './components/ConfigProvider';
import { KeybindsProvider } from './components/KeybindsProvider';
import { TabsManagerProvider } from './components/TabsManagerProvider';
import { TerminalsManagerProvider } from './components/TerminalsManagerProvider';

const root = document.getElementById('root');

render(
  () => (
    <ConfigProvider>
      <TerminalsManagerProvider>
        <KeybindsProvider>
          <TabsManagerProvider>
            <App />
          </TabsManagerProvider>
        </KeybindsProvider>
      </TerminalsManagerProvider>
    </ConfigProvider>
  ),
  root!,
);
