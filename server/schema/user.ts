import { Schema, model } from 'mongoose'

import { Document, WithId } from 'mongodb'
import { UserRole } from '../types'
import { AsTenantSchema, IAsTenant } from './asTenant'
import { IPermission, PermissionSchema } from './permission'
import { ISession, SessionSchema } from './session'

export interface IUser {
  uid: string
  name: string
  email: string
  phoneNumber?: string
  emailVerified: boolean
  verifiedByAdmin: boolean
  userRole: UserRole[]
  profileUrl?: string
  sessions?: ISession[]
  asTenant?: IAsTenant
  permissions?: IPermission[]
  createdAt?: Date
  updatedAt?: Date
}

const UserSchema = new Schema<IUser>(
  {
    uid: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, unique: true },
    emailVerified: { type: Boolean, required: true, default: false },
    verifiedByAdmin: { type: Boolean, required: true, default: false },
    userRole: {
      type: [String],
      required: true,
      enum: [UserRole.ADMIN, UserRole.OWNER, UserRole.TENANT, UserRole.USER],
      default: [UserRole.USER],
    },
    profileUrl: { type: String },
    sessions: { type: [SessionSchema], required: false, default: [] },
    asTenant: { type: AsTenantSchema, required: false, default: undefined },
    permissions: { type: [PermissionSchema], required: false, default: [] },
  },
  { timestamps: true }
)

const UserModel = model<IUser>('Users', UserSchema)

export type IUserDocument = IUser & WithId<Document>

export default UserModel
