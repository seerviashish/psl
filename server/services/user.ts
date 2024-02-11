import jwt from 'jsonwebtoken'
import Common from '../global/common'
import Config, { EnvConfigKey } from '../global/config'
import FireBase from '../global/firebase'
import FeatureModel from '../schema/feature'
import PermissionModel from '../schema/permission'
import UserModel, { IUserDocument } from '../schema/user'
import {
  SignInInput,
  SignUpInput,
  User,
  UserRole,
  ValidationError,
  ValidationResult,
} from '../types'

class UserService extends Common {
  private static instance: UserService

  private constructor() {
    super()
    this.updateEmailVerified = this.updateEmailVerified.bind(this)
    this.verifyToken = this.verifyToken.bind(this)
    this.validateSignUpInput = this.validateSignUpInput.bind(this)
    this.createUser = this.createUser.bind(this)
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  public async createUser(
    name: string,
    email: string,
    password: string,
    userRole: UserRole[],
    phoneNumber?: string
  ): Promise<{ isCreated: boolean; user?: IUserDocument }> {
    try {
      const firebase = FireBase.getInstance()
      const firebaseUserCreation = await firebase.createUser(
        name,
        email,
        password,
        phoneNumber
      )
      this.logFunctionDebug(
        this.createUser.name,
        'firebaseUserCreation response: ',
        { firebaseUserCreation }
      )
      if (!firebaseUserCreation.isCreated) {
        return { isCreated: false }
      }
      const defaultUserFeature = await FeatureModel.findOne({
        code: 'DEFAULT_USER',
      })
      this.logFunctionDebug(
        this.createUser.name,
        'default feature document result: ',
        { defaultUserFeature }
      )
      if (!defaultUserFeature) {
        return { isCreated: false }
      }
      const defaultUserPermissionModel = new PermissionModel({
        for: defaultUserFeature._id,
        as: 3,
      })
      const defaultUserPermission = await defaultUserPermissionModel.save()
      this.logFunctionDebug(
        this.createUser.name,
        'default user permission document result: ',
        { defaultUserPermission }
      )
      const userModel = new UserModel({
        uid: firebaseUserCreation.uid,
        name,
        email,
        userRole,
        phoneNumber,
        emailVerified: false,
        verifiedByAdmin: false,
        permissions: [defaultUserPermission._id],
      })
      const user = await userModel.save()
      this.logFunctionDebug(
        __filename,
        this.createUser.name,
        'Database userModel save response: ',
        { id: user?.id }
      )
      if (!user) {
        return { isCreated: false }
      }
      return { isCreated: true, user }
    } catch (error) {
      this.logFunctionError(__filename, this.createUser.name, error, {
        name,
        email,
        password,
        phoneNumber,
        userRole,
      })
      return { isCreated: false }
    }
  }

  public async deleteUserById(id: string): Promise<boolean> {
    try {
      await UserModel.findById(id)
      // const deletedUserDocument = await UserModel.deleteOne({ _id: id })
      // const firebase = FireBase.getInstance()

      // firebase.deleteUser(userDocument?.uid)
      return false
    } catch (error) {
      this.logFunctionError(__filename, this.deleteUserById.name, error, { id })
      return false
    }
  }

  public async validateSignUpInput(
    input: SignUpInput
  ): Promise<ValidationResult> {
    let isValid = true
    const errors: ValidationError[] = []
    const { name, email, password, phoneNumber, userRole } = input
    if (name.trim().length === 0) {
      isValid = false
      errors.push({
        fieldKey: 'name',
        message: 'Name should not be empty string',
      })
    }
    if (email.trim().length === 0) {
      isValid = false
      errors.push({
        fieldKey: 'email',
        message: 'Email should not be empty string',
      })
    }
    if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      isValid = false
      errors.push({
        fieldKey: 'email',
        message: 'Email address is not valid',
      })
    }
    if (password.trim().length === 0) {
      isValid = false
      errors.push({
        fieldKey: 'password',
        message: 'Password should not be empty string',
      })
    }
    if (
      !password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
      )
    ) {
      isValid = false
      errors.push({
        fieldKey: 'password',
        message:
          '1. Password should have minimum 8 characters.\n2. Password should have at least 1 upper case english letter.\n3. Password should have at least 1 lower case english letter.\n4. Password should have at least 1 digit.\n5. Password should have one special character. i.e #?!@$%^&*-',
      })
    }
    if (phoneNumber.trim().length === 0) {
      isValid = false
      errors.push({
        fieldKey: 'phoneNumber',
        message: 'Phone number should not be empty string',
      })
    }
    if (userRole.trim().length === 0) {
      isValid = false
      errors.push({
        fieldKey: 'userRole',
        message: 'User role should not be empty string',
      })
    }
    if (isValid) {
      const userExistsByEmailOrPhoneNumber = await UserModel.exists({
        $or: [{ email }, { phoneNumber }],
      })
      if (userExistsByEmailOrPhoneNumber != null) {
        isValid = false
        errors.push({
          fieldKey: 'email',
          message: 'Email address already exist',
        })
      }
    }
    return { isValid, errors }
  }
  public async validateSignInInput(
    input: SignInInput
  ): Promise<ValidationResult> {
    let isValid = true
    const errors: ValidationError[] = []
    const { email, idToken } = input
    if (email.trim().length === 0) {
      isValid = false
      errors.push({
        fieldKey: 'email',
        message: 'Email should not be empty string',
      })
    }
    if (idToken.trim().length === 0) {
      isValid = false
      errors.push({
        fieldKey: 'idToken',
        message: 'Token should not be empty string',
      })
    }
    if (isValid) {
      const userExists = await UserModel.findOne().where('email').equals(email)
      let verification = false
      if (!userExists || !userExists?.uid) {
        isValid = false
        errors.push({
          fieldKey: 'email',
          message: 'Email address does not exist',
        })
      }
      if (isValid && userExists?.uid && idToken) {
        const firebase = FireBase.getInstance()
        verification = await firebase.verifySignInIdToken(
          idToken,
          userExists.uid
        )
      }

      if (!verification) {
        isValid = false
        errors.push({
          fieldKey: 'idToken',
          message: 'Invalid token received',
        })
      }
    }
    return { isValid, errors }
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
  ): Promise<{ isValid: boolean; user?: User; message?: string }> {
    if (!token) {
      return { isValid: false, message: '' }
    }
    const config = Config.getInstance()
    const JWT_SECRET = config.getConfig(EnvConfigKey.JWT_SECRET)
    const decodedToken = jwt.verify(token, JWT_SECRET)
    if (!decodedToken) {
      return { isValid: false, message: '' }
    }
    // const userModelData = await UserModel.findById(
    //   (decodedToken as AuthToken).sid
    // )
    // if (!userModelData) {
    //   return { isValid: false, message: '' }
    // }
    return {
      isValid: true,
      message: '',
    }
  }
}

export default UserService
