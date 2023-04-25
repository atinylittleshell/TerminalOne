/* eslint-disable @next/next/no-img-element */
'use client';

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

const Page = () => {
  const { config } = useConfigContext();
  const [tabId, setTabId] = useState<number>(0);
  const [userTabIds, setUserTabIds] = useState<number[]>([1]);

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
        <button
          className="btn btn-sm btn-ghost btn-square"
          disabled={tabId === 0}
          onClick={() => {
            if (tabId === 0) {
              return;
            }
            const newTabs = _.without(userTabIds, tabId);
            setUserTabIds(newTabs);
            setTabId(_.max(newTabs) || 0);
          }}
        >
          <FiMinus />
        </button>
        <button
          className="btn btn-sm btn-ghost btn-square"
          onClick={() => {
            const newTabId = (_.max(userTabIds) || 0) + 1;
            setUserTabIds([...userTabIds, newTabId]);
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
        }}
      >
        <div className="flex-1 relative overflow-hidden">
          {tabId === 0 && <SettingsPage />}
          {userTabIds.map((userTabId) => (
            <Terminal key={userTabId} active={tabId === userTabId} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
