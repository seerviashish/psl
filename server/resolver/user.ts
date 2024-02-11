/* eslint-disable @typescript-eslint/no-unused-vars */
import { GraphQLResolveInfo } from 'graphql'
import Common from '../global/common'
import { ExtendedError } from '../graphql/error'
import { ISessionDocument } from '../schema/session'
import { IUserDocument } from '../schema/user'
import AuthService from '../services/auth'
import SessionService from '../services/session'
import UserService from '../services/user'
import {
  Auth,
  AuthSteps,
  ErrorCode,
  ErrorLevel,
  ErrorResponseKey,
  ErrorType,
  ServerContext,
  SignInInput,
  SignUpInput,
  TokenType,
  User,
  UserRole,
} from '../types'

class UserResolver extends Common {
  private static instance: UserResolver
  private userService?: UserService
  private sessionService?: SessionService
  private authService?: AuthService

  private constructor() {
    super()
    this.signIn = this.signIn.bind(this)
    this.signUp = this.signUp.bind(this)
    this.init = this.init.bind(this)
    this.getUserFrom = this.getUserFrom.bind(this)
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
    return {
      id: 'id',
      name: 'Name',
      email: 'da',
      phoneNumber: '124123',
      emailVerified: false,
      verifiedByAdmin: false,
      authStep: {
        previous: AuthSteps.SIGN_IN,
        next: AuthSteps.REDIRECT_TO_HOME,
      },
      refreshToken: 'dad',
      token: 'dadafa',
      userRole: [UserRole.USER],
    } as Auth
  }

  private async getUserFrom(userDocument?: IUserDocument): Promise<User> {
    return {
      id: '1',
      name: 'dad',
      email: 'daad',
      emailVerified: false,
      verifiedByAdmin: false,
      userRole: [UserRole.USER],
    }
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
      const { xForwardedFor, userAgent, xClientKey, xAppId } = context
      const sessionCreation = await this.sessionService?.createSession({
        clientKey: xClientKey as string,
        appId: xAppId as string,
        userId: (userCreation?.user as IUserDocument)._id,
        userAgent,
        ipv4: xForwardedFor as string,
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
      if (
        (!xAppId && typeof xAppId === 'string') ||
        (typeof xAppId === 'object' && xAppId?.length > 0)
      ) {
        throw this.extendedGraphQLError?.generateError(
          ErrorCode.CLIENT_HEADERS_ERROR_0001,
          'xAppId header not found',
          ErrorType.EXTENDED_ERROR,
          null,
          null
        )
      }

      const refreshToken = await this.authService?.generateTokens(
        TokenType.REFRESH_TOKEN,
        xAppId as string,
        userCreation?.user as IUserDocument,
        sessionCreation?.session as ISessionDocument,
        []
      )

      const sessionToken = await this.authService?.generateTokens(
        TokenType.SESSION_TOKEN,
        xAppId as string,
        userCreation?.user as IUserDocument,
        sessionCreation?.session as ISessionDocument,
        []
      )

      if (!refreshToken?.isGenerated || !sessionToken?.isGenerated) {
        throw this.extendedGraphQLError?.generateError(
          ErrorCode.SIGN_UP_ERROR_0004,
          'tokens generation failed',
          ErrorType.EXTENDED_ERROR,
          null,
          null
        )
      }

      const user = await this.getUserFrom(userCreation?.user)
      return {
        ...user,
        token: sessionToken?.token,
        refreshToken: refreshToken?.token,
        authStep: {
          previous: AuthSteps.SIGN_UP,
          next: AuthSteps.REDIRECT_TO_EMAIL_VERIFICATION,
        },
      } as Auth
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
    this.userService = UserService.getInstance()
    this.authService = AuthService.getInstance()
    this.sessionService = SessionService.getInstance()
    return UserResolver.instance
  }
}

export default UserResolver
