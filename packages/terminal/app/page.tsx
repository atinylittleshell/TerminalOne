/* eslint-disable @next/next/no-img-element */
'use client';

import _ from 'lodash';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { FiMenu, FiPlus, FiX, FiEdit2 } from 'react-icons/fi';

import SettingsPage from '../components/SettingsPage';
import { useConfigContext } from '../hooks/ConfigContext';
import { useKeybindContext } from '../hooks/KeybindContext';

const TitleBar = dynamic(() => import('../components/TitleBar'), {
  ssr: false,
});
const Tab = dynamic(() => import('../components/Tab'), {
  ssr: false,
});

type UserTab = {
  tabId: number;
  tabName: string;
};

const Page = () => {
  const { config, loading } = useConfigContext();
  const { commands } = useKeybindContext();

  const [tabId, setTabId] = useState<number>(0);
  const [userTabs, setUserTabs] = useState<UserTab[]>([]);

  const createTab = useCallback(() => {
    let newTabId = (_.max(userTabs.map((t) => t.tabId)) || 0) + 1;
    for (let i = 0; i < userTabs.length - 1; i++) {
      if (userTabs[i + 1].tabId > userTabs[i].tabId + 1) {
        newTabId = userTabs[i].tabId + 1;
        break;
      }
    }
    setUserTabs(
      [
        ...userTabs,
        {
          tabId: newTabId,
          tabName: `Tab ${newTabId}`,
          shellName:
            config.shells.length === 1 ? config.defaultShellName : null,
        },
      ].sort((a, b) => a.tabId - b.tabId),
    );
    setTabId(newTabId);
  }, [userTabs, config]);

  const closeTab = useCallback(
    (targetTabId: number) => {
      const newTabs = userTabs.filter((t) => t.tabId !== targetTabId);
      if (newTabs.length === 0) {
        window.TerminalOne?.app.quit();
      } else {
        setUserTabs(newTabs);
        setTabId(_.max(newTabs.map((t) => t.tabId)) || 0);
      }
    },
    [userTabs],
  );
  const closeCurrentTab = useCallback(() => {
    closeTab(tabId);
  }, [closeTab, tabId]);

  const nextTab = useCallback(() => {
    const currentTabIndex = userTabs.findIndex((t) => t.tabId === tabId);
    if (currentTabIndex === -1) {
      return;
    }
    let nextTabIndex = currentTabIndex + 1;
    if (nextTabIndex >= userTabs.length) {
      nextTabIndex = 0;
    }

    const nextTabId = userTabs[nextTabIndex].tabId;
    setTabId(nextTabId);
  }, [userTabs, tabId]);

  const previousTab = useCallback(() => {
    const currentTabIndex = userTabs.findIndex((t) => t.tabId === tabId);
    if (currentTabIndex === -1) {
      return;
    }
    let prevTabIndex = currentTabIndex - 1;
    if (prevTabIndex < 0) {
      prevTabIndex = userTabs.length - 1;
    }

    const prevTabId = userTabs[prevTabIndex].tabId;
    setTabId(prevTabId);
  }, [userTabs, tabId]);

  const switchToTab = useCallback(
    (targetTabId: number) => {
      if (targetTabId === 0 || targetTabId === tabId) {
        return;
      }

      if (!userTabs.some((t) => t.tabId === targetTabId)) {
        return;
      }
      setTabId(targetTabId);
    },
    [userTabs, tabId],
  );
  const switchToTab1 = useCallback(() => {
    switchToTab(1);
  }, [switchToTab]);
  const switchToTab2 = useCallback(() => {
    switchToTab(2);
  }, [switchToTab]);
  const switchToTab3 = useCallback(() => {
    switchToTab(3);
  }, [switchToTab]);
  const switchToTab4 = useCallback(() => {
    switchToTab(4);
  }, [switchToTab]);
  const switchToTab5 = useCallback(() => {
    switchToTab(5);
  }, [switchToTab]);
  const switchToTab6 = useCallback(() => {
    switchToTab(6);
  }, [switchToTab]);
  const switchToTab7 = useCallback(() => {
    switchToTab(7);
  }, [switchToTab]);
  const switchToTab8 = useCallback(() => {
    switchToTab(8);
  }, [switchToTab]);
  const switchToTab9 = useCallback(() => {
    switchToTab(9);
  }, [switchToTab]);

  const renameTab = useCallback(
    (targetTabId: number, newTabName: string) => {
      const newTabs = userTabs.map((t) =>
        t.tabId === targetTabId ? { ...t, tabName: newTabName } : t,
      );
      setUserTabs(newTabs);
    },
    [userTabs],
  );

  useEffect(() => {
    commands.on('createTab', createTab);
    commands.on('closeTab', closeCurrentTab);
    commands.on('nextTab', nextTab);
    commands.on('previousTab', previousTab);
    commands.on('tab1', switchToTab1);
    commands.on('tab2', switchToTab2);
    commands.on('tab3', switchToTab3);
    commands.on('tab4', switchToTab4);
    commands.on('tab5', switchToTab5);
    commands.on('tab6', switchToTab6);
    commands.on('tab7', switchToTab7);
    commands.on('tab8', switchToTab8);
    commands.on('tab9', switchToTab9);

    return () => {
      commands.off('createTab', createTab);
      commands.off('closeTab', closeCurrentTab);
      commands.off('nextTab', nextTab);
      commands.off('previousTab', previousTab);
      commands.off('tab1', switchToTab1);
      commands.off('tab2', switchToTab2);
      commands.off('tab3', switchToTab3);
      commands.off('tab4', switchToTab4);
      commands.off('tab5', switchToTab5);
      commands.off('tab6', switchToTab6);
      commands.off('tab7', switchToTab7);
      commands.off('tab8', switchToTab8);
      commands.off('tab9', switchToTab9);
    };
  }, [
    commands,
    createTab,
    closeCurrentTab,
    nextTab,
    previousTab,
    switchToTab1,
    switchToTab2,
    switchToTab3,
    switchToTab4,
    switchToTab5,
    switchToTab6,
    switchToTab7,
    switchToTab8,
    switchToTab9,
  ]);

  useEffect(() => {
    if (!loading && userTabs.length === 0) {
      setTabId(1);
      setUserTabs([
        {
          tabId: 1,
          tabName: 'Tab 1',
        },
      ]);
    }
  }, [loading, config, userTabs]);

  if (loading) {
    return <div />;
  }

  return (
    <>
      <TitleBar>
        <div className="tabs">
          <a
            className={`tab tab-lifted items-center ${
              tabId === 0 ? 'tab-active' : ''
            }`}
            style={{
              backgroundColor:
                tabId === 0 ? config.colorScheme.background : undefined,
            }}
            onClick={() => {
              setTabId(0);
            }}
          >
            <FiMenu />
          </a>
          {userTabs.map((userTab) => (
            <a
              key={userTab.tabId}
              className={`tab tab-lifted items-center ${
                tabId === userTab.tabId ? 'tab-active' : ''
              }`}
              style={{
                backgroundColor:
                  tabId === userTab.tabId
                    ? config.colorScheme.background
                    : undefined,
                paddingRight: tabId === userTab.tabId ? 0 : undefined,
              }}
              onClick={() => {
                if (tabId === userTab.tabId) {
                  return;
                }
                setTabId(userTab.tabId);
              }}
            >
              {userTab.tabName}
              {userTab.tabId === tabId && (
                <>
                  <button
                    className="btn btn-ghost btn-square btn-xs opacity-50 hover:bg-transparent hover:opacity-100 ml-2"
                    onClick={() => {
                      closeTab(tabId);
                    }}
                  >
                    <FiX />
                  </button>
                  <button
                    className="btn btn-ghost btn-square btn-xs opacity-50 hover:bg-transparent hover:opacity-100 ml-2"
                    onClick={() => {
                      const newTabName = prompt(
                        'Enter new tab name:',
                        userTab.tabName,
                      );
                      if (newTabName) {
                        renameTab(tabId, newTabName);
                      }
                    }}
                  >
                    <FiEdit2 />
                  </button>
                </>
              )}
            </a>
          ))}
          <a
            className="tab tab-lifted"
            onClick={() => {
              createTab();
            }}
          >
            <FiPlus />
          </a>
        </div>
      </TitleBar>
      <div
        className="flex-1 flex overflow-hidden"
        style={{
          paddingTop: config.terminalBorderWidth,
          paddingBottom: config.terminalBorderWidth,
          paddingLeft: config.terminalBorderWidth,
          paddingRight: config.terminalBorderWidth,
          backgroundColor: config.colorScheme.background,
        }}
      >
        <div className="flex-1 relative overflow-hidden">
          {tabId === 0 && <SettingsPage />}
          {userTabs.map((userTab) => {
            return (
              <Tab
                key={userTab.tabId}
                active={tabId === userTab.tabId}
                tabId={userTab.tabId}
                tabName={userTab.tabName}
                close={() => {
                  closeTab(userTab.tabId);
                }}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Page;
