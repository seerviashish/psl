import * as firebaseAdmin from 'firebase-admin'
import { OAuth2Client } from 'google-auth-library'
import path from 'path'
import UserService from '../services/user'
import { EnvMode } from '../types'
import Common from './common'
class FireBase extends Common {
  private static instance: FireBase
  private app?: firebaseAdmin.app.App
  private googleAuthClient?: OAuth2Client
  private userService?: UserService

  private constructor() {
    super()
    this.init = this.init.bind(this)
  }

  public static getInstance(): FireBase {
    if (!FireBase.instance) {
      FireBase.instance = new FireBase()
    }
    return FireBase.instance
  }

  public init(
    _options: { debug: boolean; mode: EnvMode },
    firebaseOptions: {
      serviceCredentialFileName: string
      databaseUrl: string
      googleAuthClient: {
        clientID: string
        clientSecret: string
      }
    }
  ): FireBase {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const serviceAccount = require(
      path.resolve(process.cwd(), firebaseOptions.serviceCredentialFileName)
    )
    this.app = firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert(
        serviceAccount as firebaseAdmin.ServiceAccount
      ),
      databaseURL: firebaseOptions.databaseUrl,
    })
    this.googleAuthClient = new OAuth2Client({
      clientId: firebaseOptions.googleAuthClient.clientID,
      clientSecret: firebaseOptions.googleAuthClient.clientSecret,
    })
    return FireBase.instance
  }

  public async verifySignInIdToken(
    idToken: string,
    uid: string
  ): Promise<boolean> {
    try {
      const decodedIdToken = await this.app?.auth()?.verifyIdToken(idToken)
      return decodedIdToken?.uid === uid
    } catch (error) {
      this.logFunctionError(__filename, this.verifySignInIdToken.name, error, {
        idToken,
        uid,
      })
      return false
    }
  }

  public async createUser(
    name: string,
    email: string,
    password: string,
    phoneNumber?: string
  ): Promise<{
    isCreated: boolean
    uid?: string
  }> {
    try {
      const user = await this.app?.auth()?.createUser({
        email: email,
        emailVerified: false,
        password,
        phoneNumber,
        displayName: name,
      })
      this.logFunctionDebug(
        this.createUser.name,
        'Firebase createUser response: ',
        { user }
      )
      return user?.uid
        ? { isCreated: true, uid: user.uid }
        : { isCreated: false }
    } catch (error) {
      this.logFunctionError(__filename, this.createUser.name, error, {
        name,
        email,
        phoneNumber,
        password,
      })
      return { isCreated: false }
    }
  }

  public async deleteUser(uid: string): Promise<boolean> {
    try {
      await this.app?.auth()?.deleteUser(uid)
      return true
    } catch (error) {
      this.logFunctionError(__filename, this.deleteUser.name, error, { uid })
      return false
    }
  }
}

export default FireBase
