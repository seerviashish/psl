import { Types } from 'mongoose'
import { v4 as uuidV4 } from 'uuid'
import Common from '../global/common'
import Config, { EnvConfigKey } from '../global/config'
import ClientModel from '../schema/client'
import SessionModel, { ISession } from '../schema/session'

type CreateSessionInput = {
  clientKey: string
  userId: Types.ObjectId
  ipv4?: string
  userAgent?: string
}

type CreateSessionResult = {
  isCreated: boolean
  session?: ISession
}

class SessionService extends Common {
  private static instance: SessionService
  private constructor() {
    super()
  }
  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService()
    }
    return SessionService.instance
  }

  public async createSession(
    createSessionInput: CreateSessionInput
  ): Promise<CreateSessionResult> {
    try {
      const { userId, clientKey } = createSessionInput
      const clientDocument = await ClientModel.findOne({
        key: clientKey,
      })
      this.logFunctionDebug(
        __filename,
        this.createSession.name,
        ' client document response: ',
        { clientDocument }
      )
      if (!clientDocument || !clientDocument?.enabled) {
        return { isCreated: false }
      }
      const SESSION_EXPIRE_TIME = Config.getInstance().getConfig(
        EnvConfigKey.SESSION_EXPIRE_TIME
      )
      const SESSION_TOKEN_EXPIRE_TIME = Config.getInstance().getConfig(
        EnvConfigKey.SESSION_TOKEN_EXPIRE_TIME
      )
      const SESSION_REFRESH_TOKEN_EXPIRE_TIME = Config.getInstance().getConfig(
        EnvConfigKey.SESSION_REFRESH_TOKEN_EXPIRE_TIME
      )

      this.logFunctionDebug(
        __filename,
        this.createSession.name,
        ' session expire times: ',
        {
          SESSION_EXPIRE_TIME,
          SESSION_REFRESH_TOKEN_EXPIRE_TIME,
          SESSION_TOKEN_EXPIRE_TIME,
        }
      )
      const tokenId = uuidV4()
      const refreshTokenId = uuidV4()
      const sessionId = uuidV4()
      this.logFunctionDebug(
        __filename,
        this.createSession.name,
        ' session creating for: ',
        {
          tokenId,
          refreshTokenId,
          sessionId,
        }
      )
      const sessionModel = new SessionModel({
        client: clientDocument._id,
        userId,
        tokenId,
        sessionId,
        refreshTokenId,
        expire: Number(SESSION_EXPIRE_TIME),
        tokenExpire: Number(SESSION_TOKEN_EXPIRE_TIME),
        refreshTokenExpire: Number(SESSION_REFRESH_TOKEN_EXPIRE_TIME),
      })
      const sessionDocument = await sessionModel.save()
      this.logFunctionDebug(
        __filename,
        this.createSession.name,
        ' session document: ',
        {
          sessionDocument,
        }
      )
      if (!sessionDocument) {
        return { isCreated: false }
      }
      return { isCreated: true, session: sessionDocument }
    } catch (error) {
      this.logFunctionError(__filename, this.createSession.name, error, {
        createSessionInput,
      })
      return { isCreated: false }
    }
  }
}

export default SessionService
