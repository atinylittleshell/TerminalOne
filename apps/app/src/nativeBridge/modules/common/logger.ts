import { LogLevel } from '@terminalone/types';
import dayjs from 'dayjs';
import { app } from 'electron';
import EventEmitter from 'events';
import path from 'path';
import winston from 'winston';

import { getAppDirs } from '.';

export class Logger extends EventEmitter {
  private static instance: Logger;

  private constructor() {
    super();

    const logFormat = winston.format.combine(
      winston.format.timestamp({
        format: () => {
          return dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
        },
      }),
    );

    this.winstonLogger = winston.createLogger({
      level: 'info',
      format: logFormat,
      transports: app.isPackaged
        ? [
            new winston.transports.File({
              filename: path.join(getAppDirs().data, 'logs.log'),
              format: winston.format.combine(logFormat, winston.format.json()),
            }),
          ]
        : [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.colorize(),
                logFormat,
                winston.format.printf((log) => {
                  return `[${log.level}][${log.timestamp}] ${log.message}`;
                }),
              ),
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
