/* eslint-disable @typescript-eslint/no-unused-vars */
import { GraphQLResolveInfo } from 'graphql'
import Config, { EnvConfigKey } from '../global/config'
import { ExtendedError, ExtendedGraphQLError } from '../graphql/error'
import { IUserDocument } from '../schema/user'
import SessionService from '../services/session'
import UserService from '../services/user'
import {
  Auth,
  ErrorCode,
  ErrorLevel,
  ErrorResponseKey,
  ErrorType,
  ServerContext,
  SignInInput,
  SignUpInput,
} from '../types'

class UserResolver {
  private static instance: UserResolver
  private static bcryptSaltRounds: number = 10
  private static jwtSecret?: string
  private userService?: UserService
  private sessionService?: SessionService
  private extendedGraphQLError?: ExtendedGraphQLError
  private constructor() {
    this.signIn = this.signIn.bind(this)
    this.signUp = this.signUp.bind(this)
    this.init = this.init.bind(this)
  }
  public static getInstance(): UserResolver {
    if (!UserResolver.instance) {
      UserResolver.instance = new UserResolver()
    }
    return UserResolver.instance
  }

  public async signIn(
    _parent: unknown,
    args: { input: SignInInput },
    context: ServerContext,
    _info: GraphQLResolveInfo
  ): Promise<Auth> {
    return {} as Auth
  }
  public async signUp(
    _parent: unknown,
    args: { input: SignUpInput },
    context: ServerContext,
    _info: GraphQLResolveInfo
  ): Promise<Auth> {
    try {
      const validationResult = await this.userService?.validateSignUpInput(
        args.input
      )
      if (!validationResult?.isValid) {
        throw this.extendedGraphQLError?.generateError(
          ErrorCode.SIGN_UP_ERROR_0002,
          'Input details are not valid',
          ErrorType.EXTENDED_ERROR,
          {
            key: ErrorResponseKey.SIGN_UP_0001,
            level: ErrorLevel.INFO,
            data: validationResult,
          },
          null
        )
      }
      const { name, email, password, phoneNumber, userRole } = args.input
      const userCreation = await this.userService?.createUser(
        name,
        email,
        password,
        [userRole],
        phoneNumber
      )
      if (userCreation && !userCreation.isCreated) {
        throw this.extendedGraphQLError?.generateError(
          ErrorCode.SIGN_UP_ERROR_0003,
          'User creation failed',
          ErrorType.EXTENDED_ERROR,
          null,
          null
        )
      }
      const { xForwardedFor, userAgent, clientKey } = context
      if (!clientKey) {
        throw this.extendedGraphQLError?.generateError(
          ErrorCode.CLIENT_INVALID_0001,
          'clientKey is found null in context',
          ErrorType.EXTENDED_INTERNAL_ERROR,
          null,
          null
        )
      }

      const sessionCreation = await this.sessionService?.createSession({
        clientKey,
        userId: (userCreation?.user as IUserDocument)._id,
        userAgent,
        ipv4: xForwardedFor,
      })
      if (!sessionCreation?.isCreated) {
        throw this.extendedGraphQLError?.generateError(
          ErrorCode.SESSION_CREATION_FAILED_0001,
          'session creation failed',
          ErrorType.EXTENDED_INTERNAL_ERROR,
          { xForwardedFor, userAgent },
          null
        )
      }
      return {} as Auth
    } catch (error: unknown) {
      throw error instanceof ExtendedError
        ? error
        : this.extendedGraphQLError?.generateError?.(
            ErrorCode.SIGN_UP_ERROR_0001,
            error instanceof Error
              ? error.message
              : 'Error cached in signIn function',
            ErrorType.EXTENDED_UNKNOWN_ERROR,
            null,
            error
          )
    }
  }

  public init(): UserResolver {
    const config = Config.getInstance()
    this.extendedGraphQLError = ExtendedGraphQLError.getInstance()
    UserResolver.jwtSecret = config.getConfig(EnvConfigKey.JWT_SECRET)
    UserResolver.bcryptSaltRounds = parseInt(
      config.getConfig(EnvConfigKey.BCRYPT_SALT_ROUNDS)
    )
    this.userService = UserService.getInstance()
    this.sessionService = SessionService.getInstance()
    return UserResolver.instance
  }
}

export default UserResolver
