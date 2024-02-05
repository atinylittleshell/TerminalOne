import './index.css';
import 'xterm/css/xterm.css';

import { render } from 'solid-js/web';

import { App } from './App';
import { ConfigProvider } from './components/ConfigProvider';
import { KeybindsProvider } from './components/KeybindsProvider';
import { TerminalsManagerProvider } from './components/TerminalsManagerProvider';

const root = document.getElementById('root');

render(
  () => (
    <ConfigProvider>
      <TerminalsManagerProvider>
        <KeybindsProvider>
          <App />
        </KeybindsProvider>
      </TerminalsManagerProvider>
    </ConfigProvider>
  ),
  root!,
);
