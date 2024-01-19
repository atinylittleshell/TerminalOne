import _ from 'lodash';

import { TabContextProvider } from '../../hooks/TabContext';
import { TerminalTreeNode } from '../TerminalTreeNode';

const Tab = ({
  tabId,
  active,
  close,
}: {
  tabId: number;
  active: boolean;
  close: () => void;
}) => {
  return (
    <div
      className={`w-full h-full absolute ${active ? 'visible' : 'invisible'}`}
    >
      <TabContextProvider active={active} tabId={tabId} close={close}>
        <TerminalTreeNode data={null} />
      </TabContextProvider>
    </div>
  );
};

export default Tab;
