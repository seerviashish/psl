import { OAuthCredential } from 'firebase/auth'

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type AuthFormType = 'signIn' | 'signUp'

export type FormValue<T> = {
  data: T
  error: boolean
  message: string
}

export type SignInFormValue = {
  email: Optional<FormValue<string>, 'message'>
  password: Optional<FormValue<string>, 'message'>
}

export type SignUpFormValue = {
  userName: Optional<FormValue<string>, 'message'>
  email: Optional<FormValue<string>, 'message'>
  password: Optional<FormValue<string>, 'message'>
  userRole: Optional<
    FormValue<UserRole.TENANT | UserRole.OWNER | undefined>,
    'message'
  >
  phoneNumber: Optional<FormValue<string>, 'message'>
}

export enum PersonalIdentity {
  PANCARD = 'PANCARD',
  ADHARCARD = 'ADHARCARD',
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

export enum UserRole {
  USER = 'USER',
  OWNER = 'OWNER',
  TENANT = 'TENANT',
  ADMIN = 'ADMIN',
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

export enum PermissionCheckType {
  RUNTIME = 'RUNTIME',
  ONLOAD = 'ONLOAD',
}

export type PermissionCheck = `${PermissionCheckType}`

export enum ExtraPermission {
  STORAGE = 'STORAGE',
  COOKIE = 'COOKIE',
}

export type ExtraPermissionName = `${ExtraPermission}`

export type Permission = {
  id: number
  required: boolean
  name: PermissionName | ExtraPermissionName
  state: PermissionState
  status: PermissionStatus
  check: PermissionCheck
  error?: unknown
}

export type AuthState = {
  loading: boolean
  status: 'SUCCESS' | 'FAILED'
  data?: OAuthCredential
  error?: unknown
  action: 'sign-in-google' | 'sign-in' | 'sign-up-google' | 'sign-up'
}

export type SignInParams = {
  email: string
  password: string
}

export type SignUpParam = {
  email: string
  username: string
  name: string
  phoneNumber: string
  password: string
  userRole: UserRole
}

export type SignUpWithGoogleParam = {
  username: string
  email: string
  name: string
  phoneNumber: string
  userRole: UserRole
}
