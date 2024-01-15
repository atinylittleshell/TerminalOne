'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { FiFileText, FiSettings } from 'react-icons/fi';

import { useConfigContext } from '../../hooks/ConfigContext';

const SettingsPage = () => {
  const [appVersion, setAppVersion] = useState<string>('0.0.0');
  const configContext = useConfigContext();

  useEffect(() => {
    window.TerminalOne?.app.getVersion().then((version) => {
      setAppVersion(version);
    });
  }, []);

  return (
    <div
      className="flex-1 w-full h-full relative flex flex-col p-4"
      style={{
        fontFamily: configContext.config.fontFamily,
        fontSize: configContext.config.fontSize,
        fontWeight: configContext.config.fontWeight,
        lineHeight: configContext.config.lineHeight,
        color: configContext.config.colorScheme.foreground,
        backgroundColor: configContext.config.colorScheme.background,
      }}
    >
      <div>TerminalOne v{appVersion}</div>
      <div>&nbsp;</div>
      <div>
        Configuration:&nbsp;
        <a
          href="#"
          className="link"
          onClick={() => {
            window.TerminalOne?.links.openFile(configContext.configPath);
          }}
        >
          {configContext.configPath}
        </a>
      </div>
      <div>
        Logs:&nbsp;
        <a
          href="#"
          className="link"
          onClick={() => {
            window.TerminalOne?.links.openFile(configContext.logPath);
          }}
        >
          {configContext.configPath}
        </a>
      </div>
    </div>
  );
};

export default SettingsPage;
