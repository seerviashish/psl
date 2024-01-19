import { type Logger as WinstonLogger } from 'winston'
import Logger from '../global/logger'
import UserResolver from '../resolver/user'

class Resolvers {
  private static instance: Resolvers
  private log?: WinstonLogger
  private userResolver?: UserResolver
  private constructor() {}
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

  public getResolvers() {
    return {
      Query: {
        getUsers: this.userResolver?.getUsers,
        getOwners: this.userResolver?.getOwners,
        getTenants: this.userResolver?.getTenants,
        getTenant: this.userResolver?.getTenant,
        verifyUser: this.userResolver?.verifyUser,
      },
      Mutation: {
        addTenant: this.userResolver?.addTenant,
        deleteTenant: this.userResolver?.deleteTenant,
        requestForRoom: this.userResolver?.requestForRoom,
        signIn: this.userResolver?.signIn,
        signUp: this.userResolver?.signUp,
        updateTenantDetails: this.userResolver?.updateTenantDetails,
      },
    }
  }
}

export default Resolvers
