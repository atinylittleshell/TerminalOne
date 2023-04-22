/* eslint-disable @next/next/no-img-element */
import { FiEdit2 } from 'react-icons/fi';

import { useConfigContext } from '../../hooks/ConfigContext';

const SettingsPage = () => {
  const configContext = useConfigContext();

  return (
    <div className="flex-1 w-full h-full relative flex flex-col items-center gap-4 p-4">
      <img src="/logo.png" alt="Terminal One" className="w-48 h-48" />
      <div className="form-control w-full max-w-lg">
        <div className="input-group">
          <input type="text" readOnly className="input input-bordered w-full" value={configContext.configPath} />
          <button
            className="btn btn-square"
            onClick={() => {
              window.TerminalOne.links.openFile(configContext.configPath);
            }}
          >
            <FiEdit2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
