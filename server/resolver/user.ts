/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from 'bcrypt'
import { GraphQLResolveInfo } from 'graphql'
import jwt from 'jsonwebtoken'
import { v4 as uuidV4 } from 'uuid'
import Config, { EnvConfigKey } from '../global/config'
import UserModel from '../schema/user'
import {
  ActionResponse,
  ActionStatus,
  Auth,
  LimitOffset,
  Owner,
  PersonalIdentity,
  ServerContext,
  SignInInput,
  SignUpInput,
  Tenant,
  TenantCreateInput,
  TenantRoomRequest,
  TenantUpdateInput,
  User,
  UserRole,
} from '../types'

class UserResolver {
  private static instance: UserResolver
  private static bcryptSaltRounds: number = 10
  private static jwtSecret?: string
  private constructor() {}
  public static getInstance(): UserResolver {
    if (!UserResolver.instance) {
      UserResolver.instance = new UserResolver()
    }
    return UserResolver.instance
  }

  public async getOwners(
    _parent: unknown,
    args: LimitOffset,
    context: ServerContext,
    _info: GraphQLResolveInfo
  ): Promise<Array<Owner>> {
    // if (!context.user) {
    //   throw new GraphQLError('User not authenticated', {
    //     extensions: {
    //       code: 'UNAUTHENTICATED',
    //       http: {
    //         status: 404,
    //       },
    //     },
    //   })
    // }
    const users = await UserModel.find()
      .where('role')
      .equals(UserRole.OWNER)
      .limit(args?.limit ?? 10)
      .skip(args?.offset ?? 0)
    return users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    }))
  }

  public async getTenants(
    _parent: unknown,
    args: LimitOffset,
    context: ServerContext,
    _info: GraphQLResolveInfo
  ): Promise<Array<Tenant>> {
    // for (let i = 0; i < users.length; i++) {
    //   const user = users[i]
    //   if (!user.personalId) {
    //     delete user.personalId
    //   }
    //   const userModel = new UserModel({
    //     ...user,
    //   })
    //   await userModel.save()
    // }
    // return []

    const users = await UserModel.find()
      .where('role')
      .equals(UserRole.TENANT)
      .limit(args?.limit ?? 10)
      .skip(args?.offset ?? 0)
    return users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,

      fatherName: user?.fatherName ?? '',
      fatherPhoneNumber: user?.fatherPhoneNumber ?? '',
      personalId:
        user?.personalId === PersonalIdentity.ADHARCARD
          ? PersonalIdentity.ADHARCARD
          : user?.personalId === PersonalIdentity.PANCARD
            ? PersonalIdentity.PANCARD
            : undefined,
      personalIdNumber: user?.personalIdNumber ?? '',
      permanentAddress: user?.permanentAddress ?? '',
      course: user?.course ?? '',
      college: user?.college ?? '',
      roomNumber: user?.roomNumber,
      rentPaidTill: user?.rentPaidTill,
      stayFrom: user?.stayFrom,
    }))
  }

  public async getTenant(
    _parent: unknown,
    args: { id: string },
    context: ServerContext,
    _info: GraphQLResolveInfo
  ): Promise<Tenant> {
    const user = await UserModel.findById(args.id)
    if (!user) {
      throw new Error('Tenant not found')
    }
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      fatherName: user?.fatherName ?? '',
      fatherPhoneNumber: user?.fatherPhoneNumber ?? '',
      personalId:
        user?.personalId === PersonalIdentity.ADHARCARD
          ? PersonalIdentity.ADHARCARD
          : user?.personalId === PersonalIdentity.PANCARD
            ? PersonalIdentity.PANCARD
            : undefined,
      personalIdNumber: user?.personalIdNumber ?? '',
      permanentAddress: user?.permanentAddress ?? '',
      course: user?.course ?? '',
      college: user?.college ?? '',
      roomNumber: user?.roomNumber,
      rentPaidTill: user?.rentPaidTill,
      stayFrom: user?.stayFrom,
    }
  }

  public async getUsers(
    _parent: unknown,
    args: LimitOffset,
    context: ServerContext,
    _info: GraphQLResolveInfo
  ): Promise<Array<User>> {
    const users = await UserModel.find()
      .limit(args?.limit ?? 10)
      .skip(args?.offset ?? 0)
    return users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isEmailVerified: user?.isEmailVerified ?? false,
      isVerifiedByAdmin: user?.isVerifiedByAdmin ?? false,
      role: user.role,
    }))
  }

  public async signIn(
    _parent: unknown,
    args: { input: SignInInput },
    context: ServerContext,
    _info: GraphQLResolveInfo
  ): Promise<Auth> {
    const user = await UserModel.findOne()
      .where('email')
      .equals(args.input.email)
    if (!user) {
      throw new Error('User not found')
    }
    const isPasswordMatched = await bcrypt.compare(
      args.input.password,
      user.password
    )
    if (!isPasswordMatched) {
      throw new Error('Password is incorrect')
    }
    if (!UserResolver?.jwtSecret) {
      throw new Error('Jwt token creation failed')
    }
    const token = jwt.sign(
      { name: user.name, email: user.email, role: user.role },
      UserResolver.jwtSecret,
      {
        algorithm: 'HS256',
        subject: user._id.toString(),
        expiresIn: '12h',
        jwtid: uuidV4(),
      }
    )
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isEmailVerified: user.isEmailVerified,
      isVerifiedByAdmin: user.isVerifiedByAdmin,
      role: user.role,
      token,
    }
  }

  public async signUp(
    _parent: unknown,
    args: { input: SignUpInput },
    context: ServerContext,
    _info: GraphQLResolveInfo
  ): Promise<Auth> {
    const user = await UserModel.findOne()
      .where('email')
      .equals(args.input.email)
    if (user) {
      throw new Error('User already exist!')
    }
    const passwordHash = await bcrypt.hash(
      args.input.password,
      UserResolver.bcryptSaltRounds
    )
    const newUser = new UserModel({
      name: args.input.name,
      email: args.input.email,
      password: passwordHash,
      phoneNumber: args.input.phoneNumber,
      role: args.input.role,
    })
    const savedUser = await newUser.save()
    if (!savedUser) {
      throw new Error('User creation failed')
    }
    if (!UserResolver?.jwtSecret) {
      throw new Error('Jwt token creation failed')
    }
    const token = jwt.sign(
      { name: savedUser.name, email: savedUser.email, role: savedUser.role },
      UserResolver.jwtSecret,
      {
        algorithm: 'HS256',
        subject: savedUser._id.toString(),
        expiresIn: '12h',
        jwtid: uuidV4(),
      }
    )
    return {
      id: savedUser._id.toString(),
      name: savedUser.name,
      email: savedUser.email,
      phoneNumber: savedUser.phoneNumber,
      isEmailVerified: savedUser.isEmailVerified,
      isVerifiedByAdmin: savedUser.isVerifiedByAdmin,
      role: savedUser.role,
      token,
    }
  }

  public verifyUser(
    _parent: unknown,
    args: unknown,
    context: ServerContext,
    _info: GraphQLResolveInfo
  ): ActionResponse {
    // TODO: Verify Auth TOKEN and send verification link

    return {
      status: ActionStatus.SUCCESS,
      message: 'You will be receiving email for verification',
    }
  }

  public async updateTenantDetails(
    _parent: unknown,
    args: { input: TenantUpdateInput },
    context: ServerContext,
    _info: GraphQLResolveInfo
  ): Promise<Tenant> {
    const tenantUser = await UserModel.findByIdAndUpdate(args.input.tenantId, {
      ...(args.input?.name ? { name: args.input.name } : {}),
      ...(args.input?.college ? { college: args.input.college } : {}),
      ...(args.input?.course ? { course: args.input.course } : {}),
      ...(args.input?.fatherName ? { fatherName: args.input.fatherName } : {}),
      ...(args.input?.fatherPhoneNumber
        ? { fatherPhoneNumber: args.input.fatherPhoneNumber }
        : {}),
      ...(args.input?.permanentAddress
        ? { permanentAddress: args.input.permanentAddress }
        : {}),
      ...(args.input?.personalId ? { personalId: args.input.personalId } : {}),
      ...(args.input?.personalIdNumber
        ? { personalIdNumber: args.input.personalIdNumber }
        : {}),
      ...(args.input?.phoneNumber
        ? { phoneNumber: args.input.phoneNumber }
        : {}),
      ...(args.input?.rentPaidTill
        ? { rentPaidTill: args.input.rentPaidTill }
        : {}),
      ...(args.input?.roomNumber ? { phoneNumber: args.input.roomNumber } : {}),
      ...(args.input?.stayFrom ? { stayFrom: args.input.stayFrom } : {}),
    })
    if (!tenantUser) {
      throw new Error('Tenant update failed')
    }
    return {
      id: tenantUser.id,
      name: tenantUser.name,
      email: tenantUser.email,
      phoneNumber: tenantUser.phoneNumber,
      fatherName: tenantUser?.fatherName,
      fatherPhoneNumber: tenantUser?.fatherPhoneNumber,
      personalId:
        tenantUser?.personalId === PersonalIdentity.ADHARCARD
          ? PersonalIdentity.ADHARCARD
          : tenantUser?.personalId === PersonalIdentity.PANCARD
            ? PersonalIdentity.PANCARD
            : undefined,
      personalIdNumber: tenantUser?.personalIdNumber,
      permanentAddress: tenantUser?.permanentAddress,
      course: tenantUser?.course,
      college: tenantUser?.college,
      roomNumber: tenantUser?.roomNumber,
      rentPaidTill: tenantUser?.rentPaidTill,
      stayFrom: tenantUser?.stayFrom,
    }
  }

  public async deleteTenant(
    _parent: unknown,
    args: { id: string },
    context: ServerContext,
    _info: GraphQLResolveInfo
  ): Promise<ActionResponse> {
    const deletedTenant = await UserModel.deleteOne({ _id: args.id })
    if (deletedTenant.deletedCount === 1) {
      return {
        status: ActionStatus.SUCCESS,
        message: `Tenant user is being deleted`,
      }
    } else {
      return {
        status: ActionStatus.FAILED,
        message: `Tenant user deletion failed`,
      }
    }
  }

  public async addTenant(
    _parent: unknown,
    args: { input: TenantCreateInput },
    context: ServerContext,
    _info: GraphQLResolveInfo
  ): Promise<ActionResponse> {
    const tenantUser = new UserModel({
      ...args.input,
    })
    const createTenantUser = await tenantUser.save()
    if (createTenantUser) {
      return {
        status: ActionStatus.SUCCESS,
        message: 'Tenant user create successfully',
      }
    } else {
      return {
        status: ActionStatus.FAILED,
        message: 'Tenant user creation failed',
      }
    }
  }

  public async requestForRoom(
    _parent: unknown,
    args: TenantRoomRequest,
    context: ServerContext,
    _info: GraphQLResolveInfo
  ): Promise<ActionResponse> {
    return {
      status: ActionStatus.SUCCESS,
      message: 'message',
    }
  }

  public init(): UserResolver {
    const config = Config.getInstance()
    UserResolver.jwtSecret = config.getConfig(EnvConfigKey.JWT_SECRET)
    UserResolver.bcryptSaltRounds = parseInt(
      config.getConfig(EnvConfigKey.BCRYPT_SALT_ROUNDS)
    )
    return UserResolver.instance
  }
}

export default UserResolver
