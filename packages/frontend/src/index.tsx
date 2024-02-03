import { render } from 'solid-js/web';

import './index.css';
import 'xterm/css/xterm.css';
import { App } from './App';

const root = document.getElementById('root');

render(() => <App />, root!);
