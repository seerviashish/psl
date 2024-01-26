import { GraphQLError } from 'graphql'
import { type Logger as WinstonLogger } from 'winston'
import Config from '../global/config'
import Logger from '../global/logger'
import { ErrorCode, ErrorLevel, ErrorType } from '../types'

export class ExtendedError extends GraphQLError {
  readonly code: ErrorCode
  readonly type: ErrorType
  readonly message: string
  readonly error: unknown
  readonly response: unknown

  constructor(
    code: ErrorCode,
    message: string,
    type: ErrorType,
    response: unknown,
    error: unknown
  ) {
    super(message, {
      originalError: (error ?? null) as Error,
      extensions: {
        code,
        type,
        response:
          response != null &&
          (response as { level?: ErrorLevel })?.level != null &&
          [ErrorLevel.INFO].includes((response as { level: ErrorLevel }).level)
            ? response
            : null,
      },
    })
    this.code = code
    this.message = message
    this.error = error
    this.response = response
    this.type = type
    this.response = response
  }
}

class ExtendedGraphQLError {
  private static instance: ExtendedGraphQLError
  private log?: WinstonLogger
  private envConfig?: Config
  private constructor() {
    this.init = this.init.bind(this)
    this.generateError = this.generateError.bind(this)
  }
  public static getInstance(): ExtendedGraphQLError {
    if (!ExtendedGraphQLError.instance) {
      ExtendedGraphQLError.instance = new ExtendedGraphQLError()
    }
    return ExtendedGraphQLError.instance
  }

  public init(): ExtendedGraphQLError {
    this.envConfig = Config.getInstance()
    this.log = Logger.getInstance().getLogger()
    return this
  }

  public generateError(
    code: ErrorCode,
    message: string,
    type: ErrorType,
    response: unknown,
    error: unknown
  ): ExtendedError {
    this.log?.error(
      'Error[',
      type,
      ']: code:',
      code,
      '\nmessage:',
      message,
      '\nresponse:',
      response,
      '\noriginalError:',
      error
    )
    return new ExtendedError(code, message, type, response, error)
  }
}

export { ExtendedGraphQLError }
