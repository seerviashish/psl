import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import fs from 'fs'
import mongoose from 'mongoose'
import path from 'path'
import { type Logger as WinstonLogger } from 'winston'
import Config, { EnvConfigKey } from './global/config'
import FireBase from './global/firebase'
import Logger from './global/logger'
import Resolvers from './graphql/resolver'
import { typeDefs } from './graphql/typedef'
import UserService from './services/user'
import { EnvMode, EnvModeType, ServerOptions } from './types'

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
  }): void {
    this.log = Logger.getInstance()
      .initLogger({
        mode: options?.mode ?? 'local',
        level: options?.level ?? 'info',
        debug: options?.debug ?? false,
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
      this.firebase = FireBase.getInstance().init(
        options,
        FIREBASE_SERVICE_CREDENTIAL_FILE
      )
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

  private setUpServer(): void {
    this.apolloServer = new ApolloServer({
      typeDefs,
      resolvers: Resolvers.getInstance().init().getResolvers(),
    })
  }

  async start(options: ServerOptions): Promise<void> {
    this.writePidFile(process.pid)
    this.setLogger()
    this.setEnvConfig()
    this.setUpServer()
    this.setFirebase({ debug: options.debug, mode: options.envMode })
    await this.setDatabase({ debug: options.debug, mode: options.envMode })
    const { url } = await startStandaloneServer(this.apolloServer!, {
      context: async (data) => {
        console.log(data)
        const tokenStatus = await UserService.getInstance().verifyToken(
          data?.req?.headers?.authorization
        )
        if (!tokenStatus.isValid || !tokenStatus?.user) {
          return {}
        }
        return { user: tokenStatus.user }
      },
      listen: { port: options.port },
    })
    this.log?.info(`server : ${url}`)
  }
}

export default Server
