import EventEmitter from 'events';

export type LogLevel = 'INFO' | 'DEBUG' | 'ERROR';

export class Logger extends EventEmitter {
  private static instance: Logger;

  private constructor() {
    super();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(level: LogLevel, message: string): void {
    console.log(`[${level}] ${message}`);
    this.emit('logged', level, message);
  }

  info(message: string): void {
    this.log('INFO', message);
  }

  debug(message: string): void {
    this.log('DEBUG', message);
  }

  error(message: string): void {
    this.log('ERROR', message);
  }
}
