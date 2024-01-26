export interface IConfig {
  initConfigFromEnv(env: unknown): Config
}

export enum EnvConfigKey {
  PORT = 'PORT',
  MONGODB_URL = 'MONGODB_URL',
  MONGODB_USER = 'MONGODB_USER',
  MONGODB_PASS = 'MONGODB_PASS',
  MONGODB_DB_NAME = 'MONGODB_DB_NAME',
  COOKIE_SECRET = 'COOKIE_SECRET',
  REDIS_DB = 'REDIS_DB',
  REDIS_HOST = 'REDIS_HOST',
  REDIS_PORT = 'REDIS_PORT',
  REDIS_PASS = 'REDIS_PASS',
  REDIS_USER = 'REDIS_USER',
  SESSION_STORE = 'SESSION_STORE',
  JWT_SECRET = 'JWT_SECRET',
  BCRYPT_SALT_ROUNDS = 'BCRYPT_SALT_ROUNDS',
  FIREBASE_SERVICE_CREDENTIAL_FILE = 'FIREBASE_SERVICE_CREDENTIAL_FILE',
  FIREBASE_DATABASE_URL = 'FIREBASE_DATABASE_URL',
  GOOGLE_CLIENT_ID = 'GOOGLE_CLIENT_ID',
  GOOGLE_CLIENT_SECRET = 'GOOGLE_CLIENT_SECRET',
  LOG_FILE_PATH = 'LOG_FILE_PATH',
  SESSION_EXPIRE_TIME = 'SESSION_EXPIRE_TIME',
  SESSION_TOKEN_EXPIRE_TIME = 'SESSION_TOKEN_EXPIRE_TIME',
  SESSION_REFRESH_TOKEN_EXPIRE_TIME = 'SESSION_REFRESH_TOKEN_EXPIRE_TIME',
}

export type EnvConfig = Record<EnvConfigKey, string>

class Config implements IConfig {
  private static instance: Config
  private envConfig?: EnvConfig
  private constructor() {}
  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config()
    }
    return Config.instance
  }

  public initConfigFromEnv(env: unknown): Config {
    Object.keys(EnvConfigKey).forEach((keyName) => {
      if ((env as { [keyName: string]: string })?.[keyName] == undefined) {
        throw new Error(`Env: ${keyName} not found`)
      }
    })
    this.envConfig = env as EnvConfig
    return Config.instance
  }

  public getConfig(keyName: keyof Record<EnvConfigKey, string>): string {
    return this.envConfig?.[keyName] as string
  }
}

export default Config
