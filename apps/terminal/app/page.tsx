/* eslint-disable @next/next/no-img-element */
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FiMenu } from 'react-icons/fi';

import SettingsPage from '../components/SettingsPage';
import { useConfigContext } from '../hooks/ConfigContext';

const TitleBar = dynamic(() => import('../components/TitleBar'), {
  ssr: false,
});
const Terminal = dynamic(() => import('../components/Terminal'), {
  ssr: false,
});

const Page = () => {
  const { config } = useConfigContext();
  const [tabId, setTabId] = useState<string>('TerminalOne');
  const [userTabIds, _setUserTabIds] = useState<string[]>(['1']);

  return (
    <>
      <TitleBar>
        <div className="tabs">
          <a
            className={`tab tab-lifted ${tabId === 'TerminalOne' ? 'tab-active' : ''}`}
            onClick={() => {
              setTabId('TerminalOne');
            }}
          >
            <FiMenu />
          </a>
          {userTabIds.map((userTabId) => (
            <a
              key={userTabId}
              className={`tab tab-lifted ${tabId === userTabId ? 'tab-active' : ''}`}
              onClick={() => {
                setTabId(userTabId);
              }}
            >
              {userTabId}
            </a>
          ))}
        </div>
      </TitleBar>
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{
          paddingTop: config.tabContentPadding.top,
          paddingRight: config.tabContentPadding.right,
          paddingBottom: config.tabContentPadding.bottom,
          paddingLeft: config.tabContentPadding.left,
        }}
      >
        {tabId === 'TerminalOne' && <SettingsPage />}
        {userTabIds.map((userTabId) => (
          <Terminal key={userTabId} active={tabId === userTabId} />
        ))}
      </div>
    </>
  );
};

export default Page;
