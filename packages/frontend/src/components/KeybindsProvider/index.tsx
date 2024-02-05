import EventEmitter from 'eventemitter3';
import _ from 'lodash';
import { createContext, createMemo, ParentProps, useContext } from 'solid-js';
import { debug } from 'tauri-plugin-log-api';

import { KeybindCommand } from '../../types/keybind';
import { useConfig } from '../ConfigProvider';

type KeybindCommandEvent = Record<
  KeybindCommand,
  (srcTerminalId: string) => void
>;

type KeybindsContextData = {
  commands: EventEmitter<KeybindCommandEvent>;
  handleKey: (event: KeyboardEvent, srcTerminalId: string) => boolean;
};

type KeybindsConfig = {
  keybindLeader: string;
  keybindLookup: Record<string, KeybindCommand>;
};

const KEY_REPLACEMENTS: Record<string, string> = {
  Control: 'ctrl',
};
const MODIFIER_KEYS = new Set(['alt', 'ctrl', 'meta', 'shift']);

const keybindCommandEmitter = new EventEmitter<KeybindCommandEvent>();
const keyState: Record<string, boolean> = {};
const queuedCommands: Record<string, KeybindCommand> = {};
let lastLeaderKeyEvent: KeyboardEvent | null = null;

const isLeaderActive = (event: KeyboardEvent) => {
  return (
    lastLeaderKeyEvent && lastLeaderKeyEvent.timeStamp + 1000 > event.timeStamp
  );
};

const describeKey = (event: KeyboardEvent) => {
  const { altKey, ctrlKey, metaKey, shiftKey, key } = event;
  const modifiers = [
    altKey && 'alt',
    ctrlKey && 'ctrl',
    metaKey && 'meta',
    shiftKey && 'shift',
  ].filter(Boolean);

  return normalizeKeyDescriptor(
    modifiers.length > 0 ? `${modifiers.join('+')}+${key}` : key,
  );
};

// return value means whether the key event should be propagated to the terminal
const keyHandler = (
  event: KeyboardEvent,
  srcTerminalId: string,
  config: KeybindsConfig,
) => {
  const rawKey = event.key;
  const type = event.type;
  const key = normalizeSingleKey(rawKey);
  const keyDescriptor = describeKey(event);

  const logDebug = (dest: string, reason: string) => {
    debug(`${type}:${srcTerminalId}:${keyDescriptor}:${dest} ${reason}`);
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
    if (queuedCommands[key]) {
      logDebug('HOST', 'command queued');
      return false;
    }

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
        // the key event maps to a known keybind. we should queue the command and not pass the key to the terminal.
        queuedCommands[key] = command;
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

    // we've previously queued a command for this key during keydown, and we should now execute it on keyup.
    if (queuedCommands[key]) {
      const command = queuedCommands[key];
      keybindCommandEmitter.emit(command, srcTerminalId);
      delete queuedCommands[key];
    }
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
  const modifiers = _.uniq(
    items.filter((item) => MODIFIER_KEYS.has(item)).sort(),
  );
  const keys = items.filter((item) => !MODIFIER_KEYS.has(item));
  return [...modifiers, ...keys].join('+');
};

const KeybindsContext = createContext<KeybindsContextData>({
  commands: keybindCommandEmitter,
  handleKey: () => true,
});

export const KeybindsProvider = (props: ParentProps) => {
  const { config } = useConfig();

  const keybindConfig = createMemo<KeybindsConfig>(() => {
    const result: KeybindsConfig = {
      keybindLeader: normalizeKeyDescriptor(config.keybind_leader || 'ctrl+b'),
      keybindLookup: {},
    };

    Object.keys(config.keybinds).forEach((commandValue) => {
      const command = commandValue as KeybindCommand;
      const key = config.keybinds[command];
      if (!key) return;

      result.keybindLookup[normalizeKeyDescriptor(key)] = command;
    });

    return result;
  });

  const handleKey = (event: KeyboardEvent, srcTerminalId: string) => {
    return keyHandler(event, srcTerminalId, keybindConfig());
  };

  const value = {
    commands: keybindCommandEmitter,
    handleKey,
  };

  return (
    <KeybindsContext.Provider value={value}>
      {props.children}
    </KeybindsContext.Provider>
  );
};

export const useKeybinds = () => {
  return useContext(KeybindsContext);
};
