import { INativeBridge } from '@terminalone/types';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    TerminalOne: INativeBridge;
  }
}
