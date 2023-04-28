import { LogLevel } from '@terminalone/types';
import dayjs from 'dayjs';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

let nextId = 0;

type LogItem = {
  id: number;
  level: LogLevel;
  message: string;
  timestamp: number;
};

interface ILogContextData {
  logs: LogItem[];
  log: (_level: LogLevel, _message: string) => void;
  markAsRead: () => void;
  unreadLogCount: number;
  unreadErrorCount: number;
}

const LogContext = createContext<ILogContextData>({
  logs: [],
  log: (_level: LogLevel, _message: string) => {},
  markAsRead: () => {},
  unreadLogCount: 0,
  unreadErrorCount: 0,
});

export const LogContextProvider = (props: React.PropsWithChildren<{}>) => {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [latestReadTimestamp, setLatestReadTimestamp] = useState<number>(0);

  useEffect(() => {
    window.TerminalOne?.app.onLog((_e, level, message) => {
      setLogs((logs) => [...logs, { id: nextId++, level, message, timestamp: dayjs().unix() }]);
    });
  }, []);

  const log = useCallback((level: LogLevel, message: string) => {
    window.TerminalOne?.app.log(level, message);
  }, []);

  const markAsRead = useCallback(() => {
    setLatestReadTimestamp(dayjs().unix());
  }, []);

  const unreadLogCount = useMemo(() => {
    return logs.filter((log) => log.timestamp > latestReadTimestamp).length;
  }, [logs, latestReadTimestamp]);

  const unreadErrorCount = useMemo(() => {
    return logs.filter((log) => log.timestamp > latestReadTimestamp && log.level === 'ERROR').length;
  }, [logs, latestReadTimestamp]);

  return (
    <LogContext.Provider
      value={{
        logs,
        log,
        markAsRead,
        unreadLogCount,
        unreadErrorCount,
      }}
    >
      {props.children}
    </LogContext.Provider>
  );
};

export const useLogContext = () => {
  const contextData = useContext(LogContext);
  return contextData;
};
