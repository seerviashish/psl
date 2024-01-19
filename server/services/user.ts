import { User } from 'firebase/auth'
import jwt from 'jsonwebtoken'
import Config, { EnvConfigKey } from '../global/config'
import UserModel from '../schema/user'
import { AuthToken, User as UserType } from '../types'

class UserService {
  private static instance: UserService
  private constructor() {}
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  public async updateEmailVerified(verifiedUser: User): Promise<void> {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { email: verifiedUser.email },
        { isEmailVerified: true }
      )
      if (!updatedUser) {
        throw new Error('Verified user not found')
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async verifyToken(
    token?: string
  ): Promise<{ isValid: boolean; user?: UserType; message?: string }> {
    if (!token) {
      return { isValid: false, message: '' }
    }
    const config = Config.getInstance()
    const JWT_SECRET = config.getConfig(EnvConfigKey.JWT_SECRET)
    const decodedToken = jwt.verify(token, JWT_SECRET)
    console.log(decodedToken)
    if (!decodedToken) {
      return { isValid: false, message: '' }
    }
    const userModelData = await UserModel.findById(
      (decodedToken as AuthToken).sub
    )
    if (!userModelData) {
      return { isValid: false, message: '' }
    }
    return {
      isValid: true,
      message: '',
    }
  }
}

export default UserService
