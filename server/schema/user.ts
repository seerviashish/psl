import { Schema, model } from 'mongoose'
import { PersonalIdentity, UserRole } from '../types'

export interface IUser {
  name: string
  phoneNumber: string
  fatherName?: string
  fatherPhoneNumber?: string
  personalId?: PersonalIdentity
  personalIdNumber?: string
  permanentAddress?: string
  course?: string
  college?: string
  roomNumber?: number
  rentPaidTill?: Date
  stayFrom?: Date
  password: string
  email: string
  role: UserRole
  isEmailVerified: boolean
  isVerifiedByAdmin: boolean
  sessions?: [ISession]
}

interface ISession {
  client: string
  sessionId: string
  expire: number
  created: Date
}

const PHONE_NUMBER_REGEX =
  /^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/

const SessionSchema = new Schema<ISession>({
  client: { type: String, required: true },
  sessionId: { type: String, required: true },
  expire: { type: Number, required: true, immutable: true },
  created: { type: Date, default: Date.now, immutable: true },
})

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: (phoneNo: string) => PHONE_NUMBER_REGEX.test(phoneNo),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  fatherName: { type: String },
  fatherPhoneNumber: { type: String },
  personalId: { type: String, enum: ['ADHARCARD', 'PANCARD'] },
  role: {
    type: String,
    enum: ['ADMIN', 'TENANT', 'OWNER', 'USER'],
    default: UserRole.USER,
  },
  personalIdNumber: { type: String },
  permanentAddress: { type: String },
  college: { type: String },
  course: { type: String },
  roomNumber: { type: Number },
  rentPaidTill: { type: Date },
  stayFrom: { type: Date },
  isEmailVerified: { type: Boolean, default: false },
  isVerifiedByAdmin: { type: Boolean, default: false },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sessions: { type: [SessionSchema], required: false },
})

const UserModel = model<IUser>('User', UserSchema)

export default UserModel
