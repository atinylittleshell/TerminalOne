'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { FiMaximize2, FiMinimize2, FiMinus, FiX } from 'react-icons/fi';

import styles from './index.module.css';

function TitleBar(props: PropsWithChildren<{}>) {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    window.TerminalOne.win?.isMaximized().then((value) => {
      setIsMaximized(value);
    });
  }, []);

  return (
    <div className="flex flex-row item-center top-0 left-0 right-0 h-10 relative bg-neutral-900">
      <div className={`block absolute -z-10 top-0 left-0 right-0 bottom-0 ${styles['title-bar-drag']}`} />
      <div className="flex-1 flex">{props.children}</div>
      <div className={`flex flex-row text-white ${styles['title-bar-buttons']}`}>
        <button
          className="p-3 bg-transparent hover:bg-neutral-700"
          title="Minimize"
          onClick={() => {
            window.TerminalOne.win?.minimize();
          }}
        >
          <FiMinus size="16" />
        </button>
        <button
          className="p-3 bg-transparent hover:bg-neutral-700"
          title="Maximize"
          onClick={() => {
            if (isMaximized) {
              window.TerminalOne.win?.maximize(false);
              setIsMaximized(false);
            } else {
              window.TerminalOne.win?.maximize(true);
              setIsMaximized(true);
            }
          }}
        >
          {isMaximized ? <FiMinimize2 size="16" /> : <FiMaximize2 size="16" />}
        </button>
        <button
          className="p-3 bg-transparent hover:bg-red-500"
          title="Close"
          onClick={async () => {
            flushSync(() => {
              window.TerminalOne.app?.quit();
            });
          }}
        >
          <FiX size="16" />
        </button>
      </div>
    </div>
  );
}

export default TitleBar;
