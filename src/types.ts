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
  name: Optional<FormValue<string>, 'message'>
  email: Optional<FormValue<string>, 'message'>
  password: Optional<FormValue<string>, 'message'>
  userRole: Optional<
    FormValue<UserRole.TENANT | UserRole.OWNER | undefined>,
    'message'
  >
  country: Optional<FormValue<FBaseCountryKeyValue | null>, 'message'>
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

export enum FBaseFeatureID {
  FIREBASE_EMAIL_SIGN_UP = 'FIREBASE_EMAIL_SIGN_UP',
  FIREBASE_EMAIL_SIGN_IN = 'FIREBASE_EMAIL_SIGN_IN',
  FIREBASE_EMAIL_VERIFICATION = 'FIREBASE_EMAIL_VERIFICATION',
  PHONE_NUMBER_FIELD_IN_SIGN_UP = 'PHONE_NUMBER_FIELD_IN_SIGN_UP',
  FIREBASE_PHONE_NUMBER_VERIFICATION = 'FIREBASE_PHONE_NUMBER_VERIFICATION',
  GOOGLE_SIGN_IN = 'GOOGLE_SIGN_IN',
  GOOGLE_SIGN_UP = 'GOOGLE_SIGN_UP',
}

export type FBaseFeature = {
  id: `${FBaseFeatureID}`
  name: string
  description: string
  enabled: boolean
  dependsOn?: `${FBaseFeatureID}`[] | null | undefined
}

export enum FBaseConfigKey {
  CONFIG = 'config',
  MAINTENANCE = 'maintenance',
  COUNTRIES = 'counties',
}

export type FBaseCountryKeyValue = {
  code: string
  label: string
  phone: string
  phoneNoMask: string
}

export type FBaseCountriesKeyValue = FBaseCountryKeyValue[]

export type FBaseConfigKeyValue = {
  sha: string
  features: FBaseFeature[]
}[]

export type FBaseMaintenanceDetails = {
  from: Date
  till: Date
  duration: number
  unit: string
  message: string
  title: string
}

export type FBaseMaintenanceKeyValue = {
  sha: string
  enabled: boolean
  details?: FBaseMaintenanceDetails | null
}[]

export type FBaseConfig<Key extends `${FBaseConfigKey}`> =
  Key extends FBaseConfigKey.CONFIG
    ? FBaseConfigKeyValue
    : Key extends FBaseConfigKey.MAINTENANCE
      ? FBaseMaintenanceKeyValue
      : Key extends FBaseConfigKey.COUNTRIES
        ? FBaseCountriesKeyValue
        : null
