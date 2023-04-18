import { INativeBridge } from './utils/types';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    TerminalOne: INativeBridge;
  }
}
