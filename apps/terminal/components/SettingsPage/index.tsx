'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { FiSettings } from 'react-icons/fi';

import { useConfigContext } from '../../hooks/ConfigContext';

const SettingsPage = () => {
  const [appVersion, setAppVersion] = useState<string>('0.1.0');
  const configContext = useConfigContext();

  useEffect(() => {
    window.TerminalOne?.app.getVersion().then((version) => {
      setAppVersion(version);
    });
  }, []);

  return (
    <div className="flex-1 w-full h-full relative flex flex-col items-center gap-4 px-4">
      <img src="/logo.png" alt="Terminal One" className="w-48 h-48" />
      <div className="text-2xl font-bold mb-4">TerminalOne v{appVersion}</div>
      <div className="form-control w-full max-w-lg">
        <div className="input-group">
          <input
            type="text"
            readOnly
            className="input input-bordered w-full"
            value={configContext.configPath}
            onFocus={(e) => {
              e.target.select();
            }}
          />
          <button
            className="btn btn-primary btn-square"
            onClick={() => {
              window.TerminalOne?.links.openFile(configContext.configPath);
            }}
          >
            <FiSettings />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
