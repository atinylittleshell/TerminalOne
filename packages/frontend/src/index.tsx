import './index.css';
import 'xterm/css/xterm.css';

import { render } from 'solid-js/web';

import { App } from './App';
import { ConfigProvider } from './components/ConfigProvider';

const root = document.getElementById('root');

render(
  () => (
    <ConfigProvider>
      <App />
    </ConfigProvider>
  ),
  root!,
);
