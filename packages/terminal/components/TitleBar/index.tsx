'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { FiMaximize2, FiMinimize2, FiMinus, FiX } from 'react-icons/fi';

import styles from './index.module.css';

function TitleBar(props: PropsWithChildren<{ tabName?: string }>) {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    window.TerminalOne?.win.isMaximized().then((value) => {
      setIsMaximized(value);
    });
  }, []);

  return (
    <div
      className={`flex flex-row item-center relative ${
        window.TerminalOne?.platform === 'darwin' ? 'h-16 pt-8' : 'h-8'
      }`}
    >
      <div
        className={`block absolute -z-10 top-0 left-0 right-0 bottom-0 ${styles['title-bar-drag']}`}
      />
      <div className={`flex items-center ${styles['title-bar-buttons']}`}>
        {props.children}
      </div>
      <div className={`flex-1 tab tab-lifted ${styles['title-bar-drag']}`}>
        {props.tabName}
      </div>
      {window.TerminalOne?.platform === 'darwin' ||
      window.TerminalOne?.platform === 'linux' ? null : (
        <div
          className={`flex flex-row text-white ${styles['title-bar-buttons']}`}
        >
          <button
            className="btn btn-sm btn-ghost btn-square tab tab-lifted"
            title="Minimize"
            onClick={() => {
              window.TerminalOne?.win.minimize();
            }}
          >
            <FiMinus size="16" />
          </button>
          <button
            className="btn btn-sm btn-ghost btn-square tab tab-lifted"
            title="Maximize"
            onClick={() => {
              if (isMaximized) {
                window.TerminalOne?.win.maximize(false);
                setIsMaximized(false);
              } else {
                window.TerminalOne?.win.maximize(true);
                setIsMaximized(true);
              }
            }}
          >
            {isMaximized ? (
              <FiMinimize2 size="16" />
            ) : (
              <FiMaximize2 size="16" />
            )}
          </button>
          <button
            className="btn btn-sm btn-ghost btn-square hover:bg-error tab tab-lifted"
            title="Close"
            onClick={async () => {
              flushSync(() => {
                window.TerminalOne?.app?.quit();
              });
            }}
          >
            <FiX size="16" />
          </button>
        </div>
      )}
    </div>
  );
}

export default TitleBar;
