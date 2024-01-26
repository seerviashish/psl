import { ApolloServer } from '@apollo/server'
// import responseCachePlugin from '@apollo/server-plugin-response-cache'
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl'

import { startStandaloneServer } from '@apollo/server/standalone'
import { KeyvAdapter } from '@apollo/utils.keyvadapter'
import fs from 'fs'
import Keyv from 'keyv'
import mongoose from 'mongoose'
import path from 'path'
import { type Logger as WinstonLogger } from 'winston'
import Config, { EnvConfigKey } from './global/config'
import FireBase from './global/firebase'
import Logger from './global/logger'
import { ExtendedGraphQLError } from './graphql/error'
import Resolvers from './graphql/resolver'
import { typeDefs } from './graphql/typedef'
import ClientService from './services/client'
import UserService from './services/user'
import {
  EnvMode,
  EnvModeType,
  ErrorCode,
  ErrorLevel,
  ErrorResponseKey,
  ErrorType,
  ServerContext,
  ServerOptions,
} from './types'

class Server {
  private static PID_FILE: string = 'server.pid'
  private pidFilePath: string
  private log?: WinstonLogger
  private firebase?: FireBase
  private envConfig?: Config
  private apolloServer?: ApolloServer

  constructor() {
    this.pidFilePath = path.resolve(process.cwd(), Server.PID_FILE)
  }

  private writePidFile(pid: number) {
    fs.writeFileSync(this.pidFilePath, `${pid}`)
  }

  private async stopServer(): Promise<void> {
    this.log?.info(`Stopping server...`)
    const pid = fs.readFileSync(this.pidFilePath, 'utf-8')
    fs.unlinkSync(this.pidFilePath)
    this.log?.debug(`PID file path: ${this.pidFilePath}, PID: ${pid}`)
    if (pid == undefined) {
      throw new Error('Pid is undefined')
    }
    await mongoose.disconnect()
    this.log?.info('MongoDB connection closed')
    process.kill(Number(pid))
    this.log?.info('Server stopped')
  }

  async stop(options: { debug: boolean; level?: string }): Promise<void> {
    this.log = Logger.getInstance()
      .initLogger({ debug: options.debug, level: options?.level ?? 'info' })
      .getLogger()
    this.stopServer()
  }

  private setLogger(options?: {
    mode: EnvMode
    level: string
    debug: boolean
    logFilePath?: string
  }): void {
    this.log = Logger.getInstance()
      .initLogger({
        mode: options?.mode ?? 'local',
        level: options?.level ?? 'info',
        debug: options?.debug ?? false,
        filePath: options?.logFilePath,
      })
      .getLogger()
  }

  private setEnvConfig(): void {
    this.envConfig = Config.getInstance()
  }

  private async setFirebase(options: {
    debug: boolean
    mode: EnvMode
  }): Promise<void> {
    try {
      if (!this.envConfig) {
        throw new Error('EnvConfig not configured')
      }
      const FIREBASE_SERVICE_CREDENTIAL_FILE = this.envConfig.getConfig(
        EnvConfigKey.FIREBASE_SERVICE_CREDENTIAL_FILE
      )
      const FIREBASE_DATABASE_URL = this.envConfig.getConfig(
        EnvConfigKey.FIREBASE_DATABASE_URL
      )
      const GOOGLE_CLIENT_ID = this.envConfig.getConfig(
        EnvConfigKey.GOOGLE_CLIENT_ID
      )
      const GOOGLE_CLIENT_SECRET = this.envConfig.getConfig(
        EnvConfigKey.GOOGLE_CLIENT_SECRET
      )
      this.firebase = FireBase.getInstance().init(options, {
        serviceCredentialFileName: FIREBASE_SERVICE_CREDENTIAL_FILE,
        databaseUrl: FIREBASE_DATABASE_URL,
        googleAuthClient: {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
        },
      })
    } catch (err) {
      this.log?.error(`❌ Error on Firebase Setup:${err}`)
    }
  }

  private async setDatabase(options: {
    debug: boolean
    mode: EnvMode
  }): Promise<void> {
    try {
      if (!this.envConfig) {
        throw new Error('EnvConfig not configured')
      }
      const MONGODB_URL = this.envConfig.getConfig(EnvConfigKey.MONGODB_URL)
      const MONGODB_USER = this.envConfig.getConfig(EnvConfigKey.MONGODB_USER)
      const MONGODB_PASS = this.envConfig.getConfig(EnvConfigKey.MONGODB_PASS)
      const MONGODB_DB_NAME = this.envConfig.getConfig(
        EnvConfigKey.MONGODB_DB_NAME
      )
      await mongoose.connect(MONGODB_URL, {
        user: MONGODB_USER,
        pass: MONGODB_PASS,
        dbName: MONGODB_DB_NAME,
      })
      if (options.mode !== EnvModeType.LOCAL || options.debug) {
        mongoose.set('debug', true)
      }
      this.log?.info('✅ Connected to DB')
    } catch (err) {
      this.log?.error(`❌ Error on DB Connection:${err}`)
    }
  }

  private async setUpServer(): Promise<void> {
    if (!this.envConfig) {
      throw new Error('EnvConfig not configured')
    }
    const REDIS_DB = this.envConfig.getConfig(EnvConfigKey.REDIS_DB)
    const REDIS_HOST = this.envConfig.getConfig(EnvConfigKey.REDIS_HOST)
    const REDIS_PORT = this.envConfig.getConfig(EnvConfigKey.REDIS_PORT)
    const REDIS_PASS = this.envConfig.getConfig(EnvConfigKey.REDIS_PASS)
    const REDIS_USER = this.envConfig.getConfig(EnvConfigKey.REDIS_USER)

    this.apolloServer = new ApolloServer<ServerContext>({
      typeDefs,
      resolvers: Resolvers.getInstance().init().getResolvers(),
      cache: new KeyvAdapter(
        new Keyv(
          `redis://${REDIS_USER}:${REDIS_PASS}@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`,
          { namespace: 'psl', ttl: 30 }
        )
      ),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      formatError: (formattedError, _error) => {
        return formattedError
      },
      plugins: [ApolloServerPluginCacheControl({ defaultMaxAge: 60 })],
    })
  }

  private initExtendedError() {
    ExtendedGraphQLError.getInstance().init()
  }

  async start(options: ServerOptions): Promise<void> {
    this.writePidFile(process.pid)
    this.setLogger({
      mode: options.envMode,
      debug: options.debug,
      level: 'info',
      logFilePath: options?.logFilePath,
    })
    this.setEnvConfig()
    this.initExtendedError()
    await this.setUpServer()
    this.setFirebase({ debug: options.debug, mode: options.envMode })
    await this.setDatabase({ debug: options.debug, mode: options.envMode })
    const { url } = await startStandaloneServer(this.apolloServer!, {
      context: async (data) => {
        const extendedGraphQLError = ExtendedGraphQLError.getInstance()
        const xClientKey = data?.req?.headers?.['x-client-key']
        const xForwardedFor = data?.req?.headers?.['x-forwarded-for']
        const userAgent = data?.req?.headers?.['user-agent']
        const clientValidationResult =
          await ClientService.getInstance().validateClient(
            xClientKey as string | undefined
          )
        if (!clientValidationResult) {
          throw extendedGraphQLError.generateError(
            ErrorCode.CLIENT_INVALID_0001,
            'Invalid client key received',
            ErrorType.EXTENDED_ERROR,
            {
              key: ErrorResponseKey.CLIENT_INVALID_0001,
              level: ErrorLevel.INFO,
              data: 'Invalid client key received',
            },
            null
          )
        }
        const tokenStatus = await UserService.getInstance().verifyToken(
          data?.req?.headers?.authorization
        )
        if (!tokenStatus.isValid || !tokenStatus?.user) {
          return { clientKey: xClientKey, xForwardedFor }
        }
        return {
          user: tokenStatus.user,
          clientKey: xClientKey,
          xForwardedFor,
          userAgent,
        }
      },
      listen: { port: options.port },
    })
    this.log?.info(`server : ${url}`)
  }
}

export default Server
