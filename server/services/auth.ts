import jwt from 'jsonwebtoken'
import moment from 'moment'
import Common from '../global/common'
import Config, { EnvConfigKey } from '../global/config'
import { ISessionDocument } from '../schema/session'
import { IUserDocument } from '../schema/user'
import { AuthToken, Feature, Permission, TokenType } from '../types'

class AuthService extends Common {
  private static instance: AuthService
  private bcryptSaltRounds: number = 10
  private constructor() {
    super()
  }
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  public async generateTokens(
    tokenType: TokenType,
    appId: string,
    userDocument: IUserDocument,
    sessionDocument: ISessionDocument,
    permissions?: Permission<Feature>[]
  ): Promise<{ isGenerated: boolean; token?: string }> {
    try {
      const JWT_SECRET = Config.getInstance().getConfig(EnvConfigKey.JWT_SECRET)
      const SERVER_HOST = Config.getInstance().getConfig(
        EnvConfigKey.SERVER_HOST
      )
      if (!JWT_SECRET || !SERVER_HOST) {
        this.logFunctionError(
          __filename,
          this.generateTokens.name,
          'invalid config params',
          []
        )
        return { isGenerated: false }
      }
      const payload: AuthToken = {
        aid: appId,
        nou: userDocument.name,
        eou: userDocument.email,
        rou: userDocument.userRole,
        iat: moment().valueOf(),
        pof: permissions ?? [],
      }
      const token = jwt.sign(payload, JWT_SECRET, {
        algorithm: 'HS512',
        jwtid:
          tokenType === TokenType.REFRESH_TOKEN
            ? sessionDocument.refreshTokenId
            : sessionDocument.tokenId,
        expiresIn:
          tokenType === TokenType.REFRESH_TOKEN
            ? sessionDocument.refreshTokenExpire
            : sessionDocument.tokenExpire,
        subject: sessionDocument._id.toString(),
        issuer: SERVER_HOST,
      })
      this.logFunctionDebug(
        __filename,
        this.generateTokens.name,
        ' token generated ',
        { token },
        ' for  ',
        { tokenType, userDocument, sessionDocument }
      )
      if (!token) {
        return { isGenerated: false }
      }
      return { isGenerated: true, token }
    } catch (error) {
      this.logFunctionError(__filename, this.generateTokens.name, error, {
        tokenType,
        userDocument,
        sessionDocument,
      })
      return { isGenerated: false }
    }
  }

  public async verifyToken(
    token: string,
    appId: string,
    userDocument: IUserDocument,
    sessionDocument: ISessionDocument,
    permissions?: Permission<Feature>[]
  ): Promise<boolean> {
    try {
      const JWT_SECRET = Config.getInstance().getConfig(EnvConfigKey.JWT_SECRET)
      const SERVER_HOST = Config.getInstance().getConfig(
        EnvConfigKey.SERVER_HOST
      )
      if (!JWT_SECRET || !SERVER_HOST) {
        this.logFunctionError(
          __filename,
          this.verifyToken.name,
          'invalid config params',
          []
        )
        return false
      }
      const jwtPayload = jwt.verify(token, JWT_SECRET, {
        algorithms: ['HS512'],
        subject: sessionDocument._id.toString(),
        issuer: SERVER_HOST,
      })
      this.logFunctionDebug(
        __filename,
        this.verifyToken.name,
        ' jwt token payload ',
        { jwtPayload },
        ' for  ',
        { token, userDocument, sessionDocument, permissions, appId }
      )
      if (!token) {
        return false
      }
      return true
    } catch (error) {
      this.logFunctionError(__filename, this.verifyToken.name, error, {
        token,
        userDocument,
        sessionDocument,
      })
      return false
    }
  }
}

export default AuthService
