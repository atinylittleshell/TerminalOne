import { render } from 'solid-js/web';

import './index.css';
import 'xterm/css/xterm.css';
import { App } from './App';
import { ConfigContextProvider } from './components/ConfigProvider';

const root = document.getElementById('root');

render(
  () => (
    <ConfigContextProvider>
      <App />
    </ConfigContextProvider>
  ),
  root!,
);
