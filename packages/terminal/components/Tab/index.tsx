import _ from 'lodash';
import { useState } from 'react';

import { TabContextProvider } from '../../hooks/TabContext';
import { TerminalTreeNode } from '../TerminalTreeNode';

const Tab = ({
  tabId,
  tabName,
  active,
  close,
}: {
  tabId: number;
  tabName: string;
  active: boolean;
  close: () => void;
}) => {
  const [name, setName] = useState(tabName);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <div
      className={`w-full h-full absolute ${active ? 'visible' : 'invisible'}`}
    >
      <TabContextProvider active={active} tabId={tabId} close={close}>
        <div className="tab-header">
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="tab-name-input"
          />
        </div>
        <TerminalTreeNode data={null} />
      </TabContextProvider>
    </div>
  );
};

export default Tab;
