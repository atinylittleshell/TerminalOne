/* eslint-disable @next/next/no-img-element */
'use client';

import { DEFAULT_CONFIG } from '@terminalone/types';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FiMenu, FiMinus, FiPlus } from 'react-icons/fi';

import SettingsPage from '../components/SettingsPage';
import { useConfigContext } from '../hooks/ConfigContext';

const TitleBar = dynamic(() => import('../components/TitleBar'), {
  ssr: false,
});
const Terminal = dynamic(() => import('../components/Terminal'), {
  ssr: false,
});

type UserTab = {
  tabId: number;
  shellName: string;
};

const Page = () => {
  const { config } = useConfigContext();

  const [tabId, setTabId] = useState<number>(1);
  const [userTabs, setUserTabs] = useState<UserTab[]>([
    {
      tabId: 1,
      shellName: config.defaultShellName,
    },
  ]);

  const activeShellName = userTabs.find((t) => t.tabId === tabId)?.shellName || config.defaultShellName;
  const activeShellConfig = config.shells.find((s) => s.name === activeShellName) || DEFAULT_CONFIG.shells[0];
  const activeThemeConfig =
    tabId === 0
      ? DEFAULT_CONFIG.themes[0]
      : config.themes.find((t) => t.name === activeShellConfig.themeName) || DEFAULT_CONFIG.themes[0];

  return (
    <>
      <TitleBar>
        <div className="tabs">
          <a
            className={`tab tab-lifted ${tabId === 0 ? 'tab-active' : ''}`}
            onClick={() => {
              setTabId(0);
            }}
          >
            <FiMenu />
          </a>
          {userTabs.map((userTab) => (
            <a
              key={userTab.tabId}
              className={`tab tab-lifted ${tabId === userTab.tabId ? 'tab-active' : ''}`}
              style={{
                backgroundColor: tabId === userTab.tabId ? activeThemeConfig.background : undefined,
              }}
              onClick={() => {
                setTabId(userTab.tabId);
              }}
            >
              {userTab.tabId}
            </a>
          ))}
        </div>
        <button
          className="btn btn-sm btn-ghost btn-square"
          disabled={tabId === 0}
          onClick={() => {
            if (tabId === 0) {
              return;
            }
            const newTabs = userTabs.filter((t) => t.tabId !== tabId);
            setUserTabs(newTabs);
            setTabId(_.max(newTabs.map((t) => t.tabId)) || 0);
          }}
        >
          <FiMinus />
        </button>
        <button
          className="btn btn-sm btn-ghost btn-square"
          onClick={() => {
            const newTabId = (_.max(userTabs.map((t) => t.tabId)) || 0) + 1;
            setUserTabs([
              ...userTabs,
              {
                tabId: newTabId,
                shellName: config.defaultShellName,
              },
            ]);
            setTabId(newTabId);
          }}
        >
          <FiPlus />
        </button>
      </TitleBar>
      <div
        className="flex-1 flex overflow-hidden"
        style={{
          paddingTop: config.tabContentPadding.top,
          paddingRight: config.tabContentPadding.right,
          paddingBottom: config.tabContentPadding.bottom,
          paddingLeft: config.tabContentPadding.left,
          backgroundColor: activeThemeConfig.background,
        }}
      >
        <div className="flex-1 relative overflow-hidden">
          {tabId === 0 && <SettingsPage />}
          {userTabs.map((userTab) => (
            <Terminal key={userTab.tabId} active={tabId === userTab.tabId} shellName={userTab.shellName} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
