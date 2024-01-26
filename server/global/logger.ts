import path from 'path'
import { SPLAT } from 'triple-beam'
import {
  createLogger,
  format,
  transports,
  type Logger as WinstonLogger,
} from 'winston'
import WinstonDailyRotateFile from 'winston-daily-rotate-file'

import { EnvMode, EnvModeType } from '../types'
const { timestamp, combine, colorize, printf, errors, json } = format

type LoggerOptions = {
  mode?: EnvMode
  debug: boolean
  level?: string
  filePath?: string
}

export interface ILogger {
  initLogger(options?: LoggerOptions): ILogger
  getLogger(): WinstonLogger
}

class Logger {
  private static instance: Logger
  private logger?: WinstonLogger

  private constructor() {
    this.getLogFilePath = this.getLogFilePath.bind(this)
    this.getLogger = this.getLogger.bind(this)
    this.initLogger = this.initLogger.bind(this)
  }
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private getLogFilePath(filePath?: string): string {
    return path.resolve(process.cwd(), filePath || 'logs/psl-server-%DATE%.log')
  }

  public initLogger(options?: LoggerOptions): Logger {
    this.logger = createLogger({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS a' }),
        errors({ stack: true }),
        options?.mode != undefined && options?.mode !== EnvModeType.LOCAL
          ? json()
          : printf(({ level, message, timestamp, stack, [SPLAT]: splat }) => {
              return `${timestamp} ${level}: ${stack || message} ${
                splat
                  ?.map((data?: unknown) => {
                    return typeof data === 'object'
                      ? JSON.stringify(data)
                      : data
                  })
                  ?.filter((data?: unknown) => data != undefined)
                  ?.join(' ') ?? ''
              }`
            })
      ),
      transports: [
        new transports.Console({
          level:
            options?.debug || options?.mode === EnvModeType.LOCAL
              ? 'debug'
              : options?.level ?? 'info',
        }),
        new WinstonDailyRotateFile({
          filename: this.getLogFilePath(options?.filePath),
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
          level:
            options?.debug || options?.mode === EnvModeType.LOCAL
              ? 'debug'
              : options?.level ?? 'info',
        }),
      ],
    })
    return Logger.instance
  }

  public getLogger(): WinstonLogger {
    if (!this.logger) {
      throw new Error('Logger not initialized')
    }
    return this.logger
  }
}

export default Logger
