export type EnvMode = 'prod' | 'uat' | 'stage' | 'qa' | 'dev' | 'local'

export type ServerOptions = {
  port: number
  debug: boolean
  envMode: EnvMode
}

export enum EnvModeType {
  PROD = 'prod',
  UAT = 'uat',
  STAGE = 'stage',
  QA = 'qa',
  DEV = 'dev',
  LOCAL = 'local',
}

export enum UserRole {
  USER = 'USER',
  OWNER = 'OWNER',
  TENANT = 'TENANT',
  ADMIN = 'ADMIN',
}

export enum PersonalIdentity {
  ADHARCARD = 'ADHARCARD',
  PANCARD = 'PANCARD',
}

type IUser = {
  id: string
  name: string
  email: string
  phoneNumber: string
}

export type User = IUser & {
  isEmailVerified: boolean
  isVerifiedByAdmin: boolean
  role: UserRole
}

export type Owner = IUser

export type Tenant = IUser & {
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
}

export type Auth = User & {
  token: string
}

export interface ServerContext {
  user?: User
}

export type SignInInput = {
  email: string
  password: string
}

export type SignUpInput = {
  name: string
  phoneNumber: string
  email: string
  password: string
  role: UserRole
}

export type TenantUpdateInput = {
  tenantId: string
  name: string
  phoneNumber: string
  fatherName: string
  fatherPhoneNumber: string
  personalId: PersonalIdentity
  personalIdNumber: string
  permanentAddress: string
  course: string
  college: string
  roomNumber: number
  rentPaidTill: Date
  stayFrom: Date
}

export type TenantCreateInput = {
  name: string
  email: string
  phoneNumber: string
  fatherName: string
  fatherPhoneNumber: string
  personalId: PersonalIdentity
  personalIdNumber: string
  permanentAddress: string
  course: string
  college: string
  roomNumber: number
  rentPaidTill: Date
  stayFrom: Date
}

export enum ActionStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

export type ActionResponse = {
  status: ActionStatus
  message: string
}

export type TenantRoomRequest = {
  roomNumber: number
  roomOwnerId: string
}

export type LimitOffset = { limit?: number; offset?: number }

export type AuthToken = {
  name: string
  email: string
  role: string
  iat: number
  exp: number
  sub: string
  jti: string
}
