'use client';

import { KeybindCommand } from '@terminalone/types';
import EventEmitter from 'eventemitter3';
import _ from 'lodash';
import React, { createContext, useCallback, useContext, useMemo } from 'react';

import { useConfigContext } from './ConfigContext';

type KeybindContextData = {
  commands: EventEmitter<KeybindCommand>;
  handleKey: (event: KeyboardEvent) => boolean;
};

type KeybindConfig = {
  keybindLeader: string;
  keybindLookup: Record<string, KeybindCommand>;
};

const KEY_REPLACEMENTS: Record<string, string> = {
  Control: 'ctrl',
};
const MODIFIER_KEYS = new Set(['alt', 'ctrl', 'meta', 'shift']);

const keybindCommandEmitter = new EventEmitter<KeybindCommand>();
const keyState: Record<string, boolean> = {};
let lastLeaderKeyEvent: KeyboardEvent | null = null;

const isLeaderActive = (event: KeyboardEvent) => {
  return lastLeaderKeyEvent && lastLeaderKeyEvent.timeStamp + 1000 > event.timeStamp;
};

const describeKey = (event: KeyboardEvent) => {
  const { altKey, ctrlKey, metaKey, shiftKey, key } = event;
  const modifiers = [altKey && 'alt', ctrlKey && 'ctrl', metaKey && 'meta', shiftKey && 'shift'].filter(Boolean);

  return normalizeKeyDescriptor(modifiers.length > 0 ? `${modifiers.join('+')}+${key}` : key);
};

// return value means whether the key event should be propagated to the terminal
const keyHandler = (event: KeyboardEvent, config: KeybindConfig) => {
  const rawKey = event.key;
  const type = event.type;
  const key = normalizeSingleKey(rawKey);
  const keyDescriptor = describeKey(event);

  const logDebug = (dest: string, reason: string) => {
    window.TerminalOne?.app.log('debug', `${type}:${keyDescriptor}:${dest} ${reason}`);
  };

  logDebug('RAW', 'user input');

  // any events that happened during IME composition should not trigger TerminalOne keybinds.
  // so we just should pass them through to the actual terminal.
  if (event.isComposing) {
    return true;
  }

  if (MODIFIER_KEYS.has(key)) {
    // modifier keys should always be passed through to the terminal
    logDebug('TERM', 'modifier key');
    return true;
  }

  if (type === 'keydown') {
    if (keyDescriptor === config.keybindLeader) {
      if (isLeaderActive(event)) {
        // double leader key press means we should "escape" and cancel the active leader key,
        // and pass this latest leader key as a normal key stroke to the terminal.
        lastLeaderKeyEvent = null;
        keyState[key] = true;
        logDebug('TERM', 'double leader key');
        return true;
      } else {
        // first leader key press simply activates other keybinds. it should not be passed to the terminal.
        lastLeaderKeyEvent = event;
        logDebug('HOST', 'leader key');
        return false;
      }
    }

    if (isLeaderActive(event)) {
      const command = config.keybindLookup[keyDescriptor];

      if (command) {
        // the key event maps to a known keybind. we should emit the command and not pass the key to the terminal.
        keybindCommandEmitter.emit(command);
        lastLeaderKeyEvent = null;
        logDebug('HOST', 'keybind');
        return false;
      } else {
        // we should cancel the active leader key and pass this unbound key to the terminal.
        lastLeaderKeyEvent = null;
        keyState[key] = true;
        logDebug('TERM', 'unbound key');
        return true;
      }
    } else {
      // leader key was not active, which means we should not trigger any other keybinds yet.
      // we should pass the key to the terminal.
      keyState[key] = true;
      lastLeaderKeyEvent = null;
      logDebug('TERM', 'leader inactive');
      return true;
    }
  }

  const isSameKeyDown = Boolean(keyState[key]);
  if (type === 'keyup') {
    keyState[key] = false;
  }

  // if the key was considered pressed down, it means we had passed the keydown event to the terminal.
  // in that case, we should let keypress and keyup events on the same key pass through to the terminal as well.
  // when this is false, it means TerminalOne had "eaten" the keydown event as part of a keybind.
  logDebug(isSameKeyDown ? 'TERM' : 'HOST', 'follow keydown event');
  return isSameKeyDown;
};

const normalizeSingleKey = (rawKey: string) => {
  const key = KEY_REPLACEMENTS[rawKey] || rawKey;
  if (key.length > 1 || key < 'A' || key > 'Z') {
    return key.toLowerCase();
  }
  return key;
};

const normalizeKeyDescriptor = (keyDescriptor: string) => {
  const items = keyDescriptor.split('+').map(normalizeSingleKey);
  const modifiers = _.uniq(items.filter((item) => MODIFIER_KEYS.has(item)).sort());
  const keys = items.filter((item) => !MODIFIER_KEYS.has(item));
  return [...modifiers, ...keys].join('+');
};

const KeybindContext = createContext<KeybindContextData>({
  commands: keybindCommandEmitter,
  handleKey: () => true,
});

export const KeybindContextProvider = (props: React.PropsWithChildren) => {
  const { config } = useConfigContext();

  const keybindConfig = useMemo<KeybindConfig>(() => {
    const result: KeybindConfig = {
      keybindLeader: normalizeKeyDescriptor(config.keybindLeader || 'ctrl+b'),
      keybindLookup: {},
    };

    Object.keys(config.keybinds).forEach((commandValue) => {
      const command = commandValue as KeybindCommand;
      const key = config.keybinds[command];
      if (!key) return;

      result.keybindLookup[normalizeKeyDescriptor(key)] = command;
    });

    return result;
  }, [config]);

  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      return keyHandler(event, keybindConfig);
    },
    [keybindConfig],
  );

  const value = useMemo(
    () => ({
      commands: keybindCommandEmitter,
      handleKey,
    }),
    [handleKey],
  );

  return <KeybindContext.Provider value={value}>{props.children}</KeybindContext.Provider>;
};

export const useKeybindContext = () => {
  return useContext(KeybindContext);
};
