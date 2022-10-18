import 'xterm/css/xterm.css';

import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';

let terminal: Terminal | null = null;

function App() {
  const terminalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (terminalRef.current && !terminal) {
      terminal = new Terminal();
      terminal.open(terminalRef.current);
      terminal.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
    }
  }, []);

  return (
    <div className="w-screen h-screen absolute">
      <div className="w-screen h-screen" ref={terminalRef} />
    </div>
  );
}

export default App;
