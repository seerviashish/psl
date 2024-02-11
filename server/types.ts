import { BaseContext } from '@apollo/server'

export type EnvMode = 'prod' | 'uat' | 'stage' | 'qa' | 'dev' | 'local'

export type ServerOptions = {
  port: number
  debug: boolean
  envMode: EnvMode
  logFilePath?: string
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

export enum IdentityType {
  ADHARCARD = 'ADHARCARD',
  PANCARD = 'PANCARD',
}

export enum Feature {
  HOME_PAGE = 'HOME_PAGE',
  PROFILE_PAGE = 'PROFILE_PAGE',
  SEARCH_HOUSE = 'SEARCH_HOUSE',
  REQUEST_FOR_HOUSE = 'REQUEST_FOR_HOUSE',
  ADD_HOUSE_PAGE = 'ADD_HOUSE_PAGE',
  APPROVE_USER = 'APPROVE_USER',
  APPROVE_TENANT = 'APPROVE_TENANT',
  ADMIN_PAGE = 'ADMIN_PAGE',
  REMOVE_USER = 'REMOVE_USER',
  REJECT_TENANT = 'REJECT_TENANT',
  APPROVE_HOUSE = 'APPROVE_HOUSE',
  SIGN_RENT_RECEIPT = 'SIGN_RENT_RECEIPT',
}

export type Permission<F> = {
  for: F
  as: number
}

export type AuthToken = {
  aid: string
  eou: string
  nou: string
  rou: UserRole[]
  pof: Permission<Feature>[]
  iat: number
}

type IUser = {
  id: string
  name: string
  email: string
  phoneNumber?: string
  emailVerified: boolean
  verifiedByAdmin: boolean
  userRole: UserRole[]
  profileUrl?: string
}

export type State = {
  id: string
  code: string
  name: string
}

export type Country = {
  id: string
  code: string
  name: string
  state?: State[]
}

export type Address = {
  name: string
  number: string
  street: string
  state: State
  city: string
  country: Country
  postalCode: string
}

export type User = IUser & {
  address?: Address
}

export type Owner = User

type ParentInformation = {
  name: string
  phoneNumber: string
}

export type Father = ParentInformation
export type Mother = ParentInformation

export type Parents = {
  father?: Father
  mother?: Mother
}

export type PersonalIdentity = {
  type: IdentityType
  photoUrl: string
  isValid: boolean
  isVerified: boolean
}

export type College = {
  name: string
  address: Address
  course: string
}

export type Currency = {
  id: string
  code: string
  name: string
  symbol: string
}

export type Amenity = {
  id: string
  name: string
  details: string
  pictures?: string[]
}

export type Review = {
  id: string
  reviewerId: string
  ratting: number
  title: string
  description: string
}

export type House = {
  id: string
  ownerId: string
  rentPerMonth: number
  currency: Currency
  advanceDeposit: number
  amenities?: Amenity[]
  review?: Review[]
}

export type StayTime = {
  from: Date
  till?: Date
  isContinue: boolean
}

export type Signature = {
  id: string
  publicKey: string
  userId: string
  signature: string
  time: Date
}

export enum RentCollectionType {
  QUARTERLY = 'QUARTERLY',
  MONTHLY = 'MONTHLY',
  CUSTOM = 'CUSTOM',
  YEARLY = 'YEARLY',
}

export enum RentCollectionMonth {
  NEXT_MONTH = 'NEXT_MONTH',
  CURRENT_MONTH = 'CURRENT_MONTH',
}

export type Print = {
  isGenerated: boolean
  url?: string
  time?: Date
}

export type Receipt = {
  id: string
  version: number
  ownerSignature?: Signature
  tenantSignature?: Signature
  isOwnerSigned: boolean
  isTenantSigned: boolean
  print: Print
}

export type Rent = {
  id: string
  userId: string
  ownerId: string
  houseId: string
  rentAmount: number
  from: Date
  upto: Date
  isLastDayIncluded: boolean
  rentCollectedOn?: Date
  toBePaidTill: Date
  currency: Currency
  receipt?: Receipt
  isReceiptGenerated: boolean
}

export type RentAgreement = {
  id: string
  houseId: string
  userId: string
  ownerId: string
  isStaying: boolean
  rentCollectedOnDay: string
  rentCollectionMonth: RentCollectionMonth
  rentCollectionType: RentCollectionType
  from: Date
  end: Date
  advanceDeposit: number
  isAdvancePaid: boolean
  rentAmount: number
  incrementRatePerYear: number
  currency: Currency
  version: number
  ownerSignature?: Signature
  tenantSignature?: Signature
  isOwnerSigned: boolean
  isTenantSigned: boolean
  print: Print
}

export type Tenant = IUser & {
  address?: Address
  married: boolean
  parents?: Parents
  identity?: PersonalIdentity[]
  college?: College
  stayAt?: House
  stayTime?: StayTime[]
  rent?: Rent[]
  agreement?: RentAgreement
  isAgreementDone: boolean
}

export enum AuthSteps {
  SIGN_IN = 'SIGN_IN',
  SIGN_IN_GOOGLE = 'SIGN_IN_GOOGLE',
  REDIRECT_TO_HOME = 'REDIRECT_TO_HOME',
  SIGN_UP = 'SIGN_UP',
  REDIRECT_TO_EMAIL_VERIFICATION = 'REDIRECT_TO_EMAIL_VERIFICATION',
  REDIRECT_TO_PHONE_NUMBER_VERIFICATION = 'REDIRECT_TO_PHONE_NUMBER_VERIFICATION',
  SIGN_UP_GOOGLE = 'SIGN_UP_GOOGLE',
  REDIRECT_TO_SETUP_PASSWORD_WITH_GOOGLE_SIGNUP = 'REDIRECT_TO_SETUP_PASSWORD_WITH_GOOGLE_SIGNUP',
  REDIRECT_TO_PROFILE_UPDATE = 'REDIRECT_TO_PROFILE_UPDATE',
}

export type AuthStep = {
  previous: AuthSteps
  next: AuthSteps
}

export type Auth = User & {
  token: string
  refreshToken: string
  authStep: AuthStep
}

export interface ServerContext extends BaseContext {
  xClientKey?: string | string[]
  xAppId?: string | string[]
  xForwardedFor?: string | string[]
  user?: User
  userAgent?: string
}

export type SignInInput = {
  email: string
  idToken: string
}

export type SignUpInput = {
  name: string
  phoneNumber: string
  email: string
  password: string
  userRole: UserRole
}

export type SignUpWithGoogleInput = {
  name: string
  email: string
  profileUrl?: string
}

export type SignInWithGoogleInput = {
  email: string
  idToken: string
}

export type LimitOffset = { limit?: number; offset?: number }

export enum ErrorType {
  EXTENDED_UNKNOWN_ERROR = 'EXTENDED_UNKNOWN_ERROR',
  EXTENDED_INTERNAL_ERROR = 'EXTENDED_INTERNAL_ERROR',
  EXTENDED_ERROR = 'EXTENDED_ERROR',
}

export enum ErrorLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  SENSITIVE = 'SENSITIVE',
}

export enum ErrorResponseKey {
  UNKNOWN0001 = 'UNKNOWN0001',
  SIGN_UP_0001 = 'SIGN_UP_0001',
  CLIENT_INVALID_0001 = 'CLIENT_INVALID_0001',
  CLIENT_INVALID_0002 = 'CLIENT_INVALID_0002',
  CLIENT_HEADERS_0001 = 'CLIENT_HEADERS_0001',
  SIGN_UP_ERROR_0004 = 'SIGN_UP_ERROR_0004',
}

export enum ErrorCode {
  CLIENT_INVALID_0001 = 'CLIENT_INVALID_0001',
  CLIENT_INVALID_0002 = 'CLIENT_INVALID_0002',
  CLIENT_HEADERS_ERROR_0001 = 'CLIENT_HEADERS_ERROR_0001',
  USER_RESOLVER_0001 = 'USER_RESOLVER_0001',
  SIGN_UP_ERROR_0001 = 'SIGN_UP_ERROR_0001',
  SIGN_UP_ERROR_0002 = 'SIGN_UP_ERROR_0002',
  SIGN_UP_ERROR_0003 = 'SIGN_UP_ERROR_0003',
  SIGN_UP_ERROR_0004 = 'SIGN_UP_ERROR_0004',
  SESSION_CREATION_FAILED_0001 = 'SESSION_CREATION_FAILED_0001',
  PSL_INTERNAL_SERVER_ERROR = 'PSL_INTERNAL_SERVER_ERROR',
  PSL_UNKNOWN_ERROR = 'PSL_UNKNOWN_ERROR',
}

export type ValidationError = {
  fieldKey: string
  message: string
}

export type ValidationResult = {
  isValid: boolean
  errors?: ValidationError[]
}

export enum TokenType {
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  SESSION_TOKEN = 'SESSION_TOKEN',
}
