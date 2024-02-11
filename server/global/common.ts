import { Logger as WinstonLogger } from 'winston'
import { ExtendedGraphQLError } from '../graphql/error'
import Logger from './logger'

abstract class Common {
  protected logger?: WinstonLogger
  protected extendedGraphQLError?: ExtendedGraphQLError

  public constructor() {
    this.getLogger = this.getLogger.bind(this)
    this.logFunctionError = this.logFunctionError.bind(this)
    this.logFunctionDebug = this.logFunctionDebug.bind(this)
    this.logFunctionInfo = this.logFunctionInfo.bind(this)
    this.logFunctionWarn = this.logFunctionWarn.bind(this)
  }

  private getLogger(): WinstonLogger {
    if (!this.logger) {
      this.logger = Logger.getInstance().getLogger()
      this.extendedGraphQLError = ExtendedGraphQLError.getInstance()
    }
    return this.logger
  }

  protected logFunctionError(
    filename: string,
    functionName: string,
    error: unknown,
    params: object
  ) {
    this.getLogger().error(
      'Failed! in file: ',
      filename,
      'Error: ',
      error,
      ' occurred in ',
      functionName,
      ' function for this arguments ',
      {
        ...params,
      }
    )
  }

  protected logFunctionInfo(
    filename: string,
    functionName: string,
    ...args: unknown[]
  ) {
    this.getLogger().info(
      'Info in File: ',
      filename,
      ' for function',
      functionName,
      ...args
    )
  }

  protected logFunctionDebug(
    filename: string,
    functionName: string,
    ...args: unknown[]
  ) {
    this.getLogger().debug(
      'Debug in File: ',
      filename,
      ' for function',
      functionName,
      ...args
    )
  }

  protected logFunctionWarn(
    filename: string,
    functionName: string,
    ...args: unknown[]
  ) {
    this.getLogger().warn(
      'Debug in File: ',
      filename,
      ' for function',
      functionName,
      ...args
    )
  }
}

export default Common
