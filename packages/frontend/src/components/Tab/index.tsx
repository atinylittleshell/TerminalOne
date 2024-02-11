import _ from 'lodash';

import { TabProvider } from '../TabProvider';
import { TerminalTreeNode } from '../TerminalTreeNode';

export const Tab = (props: {
  tabId: number;
  active: boolean;
  close: () => void;
}) => {
  return (
    <div class={`w-full h-full absolute ${props.active ? 'block' : 'hidden'}`}>
      <TabProvider
        active={props.active}
        tabId={props.tabId}
        close={props.close}
      >
        <TerminalTreeNode data={null} />
      </TabProvider>
    </div>
  );
};
