import { LogLevel } from '@terminalone/types';
import EventEmitter from 'events';
import winston from 'winston';

export class Logger extends EventEmitter {
  private static instance: Logger;

  private constructor() {
    super();

    this.winstonLogger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
        new winston.transports.File({
          filename: 'logs.log',
          level: 'info',
        }),
      ],
    });
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private winstonLogger: winston.Logger;

  log(level: LogLevel, message: string): void {
    this.winstonLogger.log(level, message);
    this.emit('log', level, message);
  }
}
