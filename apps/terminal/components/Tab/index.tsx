import _ from 'lodash';

import { TabContextProvider } from '../../hooks/TabContext';
import { TerminalTreeNode } from '../TerminalTreeNode';

const Tab = ({ tabId, active }: { tabId: number; active: boolean }) => {
  return (
    <div
      className={`w-full h-full absolute ${active ? 'visible' : 'invisible'}`}
    >
      <TabContextProvider active={active} tabId={tabId}>
        <TerminalTreeNode data={null} />
      </TabContextProvider>
    </div>
  );
};

export default Tab;
