/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from 'moment'
import { type Logger as WinstonLogger } from 'winston'
import Logger from '../global/logger'
import UserResolver from '../resolver/user'
import { ServerContext } from '../types'

class Resolvers {
  private static instance: Resolvers
  private log?: WinstonLogger
  private userResolver?: UserResolver
  private n: number
  private constructor() {
    this.n = 0
    this.hello = this.hello.bind(this)
  }
  public static getInstance(): Resolvers {
    if (!Resolvers.instance) {
      Resolvers.instance = new Resolvers()
    }
    return Resolvers.instance
  }

  public init(): Resolvers {
    this.log = Logger.getInstance().getLogger()
    this.userResolver = UserResolver.getInstance().init()
    return Resolvers.instance
  }

  public hello(
    _parent: unknown,
    _args: unknown,
    context: ServerContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info: any
  ): { id: number; date?: Date; message?: string } {
    info.cacheControl.setCacheHint({ maxAge: 20, scope: 'PRIVATE' })
    return {
      id: ++this.n,
      date: moment().toDate(),
      message: 'This is 2',
    }
  }

  public getResolvers() {
    return {
      Query: {
        hello: this.hello,
      },
      Mutation: {
        signIn: this.userResolver?.signIn,
        signUp: this.userResolver?.signUp,
      },
    }
  }
}

export default Resolvers
