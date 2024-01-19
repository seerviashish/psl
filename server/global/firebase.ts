import * as firebaseAdmin from 'firebase-admin'
import path from 'path'
import { type Logger as WinstonLogger } from 'winston'
import UserService from '../services/user'
import { EnvMode } from '../types'
import Logger from './logger'

class FireBase {
  private static instance: FireBase
  private app?: firebaseAdmin.app.App
  private log?: WinstonLogger
  private userService?: UserService

  private constructor() {}
  public static getInstance(): FireBase {
    if (!FireBase.instance) {
      FireBase.instance = new FireBase()
    }
    return FireBase.instance
  }

  public init(
    _options: { debug: boolean; mode: EnvMode },
    serviceCredentialFileName: string
  ): FireBase {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const serviceAccount = require(
        path.resolve(process.cwd(), serviceCredentialFileName)
      )

      this.app = firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(serviceAccount),
      })
      // this.app
      //   .auth()
      //   .verifyIdToken(
      //     'TOKEN'
      //   )
      //   .then((data) => {
      //     console.log('data ===>', data)
      //   })
      this.log = Logger.getInstance().getLogger()
      return FireBase.instance
    } catch (error: unknown) {
      console.log('error => ', error)
      return FireBase.instance
    }
  }
}

export default FireBase
