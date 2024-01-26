// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = `#graphql
# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

# This "User" type defines the queryable fields for every User in our data source.
scalar Date
scalar DateTime

enum CacheControlScope {
  PUBLIC
  PRIVATE
}

directive @cacheControl(
  maxAge: Int
  scope: CacheControlScope
  inheritMaxAge: Boolean
) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

enum UserRole {
  USER
  OWNER
  TENANT
  ADMIN
}

enum IdentityType {
  ADHARCARD
  PANCARD
}

interface IUser {
  id: ID!
  name: String!
  email: String!
  emailVerified: Boolean!
  verifiedByAdmin: Boolean!
  userRole: [UserRole!]!
  profileUrl: String
}

type PhoneNumber {
  id: ID!
  phoneNumber: String!
  isVerified: Boolean!
}

type State {
  id: ID!
  code: String!
  name: String!
}

type Country {
  id: ID!
  code: String!
  name: String!
}

type Address {
  name: String!
  number: String!
  street: String
  state: State!
  city: String!
  country: Country!
  postalCode: String!
}

type User implements IUser {
  id: ID!
  profileUrl: String
  name: String!
  email: String!
  emailVerified: Boolean!
  verifiedByAdmin: Boolean!
  userRole: [UserRole!]!
  address: Address
}

interface ParentInformation {
  name: String!
  phoneNumber: String!
}

type Father implements ParentInformation {
  name: String!
  phoneNumber: String!
}

type Mother implements ParentInformation {
  name: String!
  phoneNumber: String!
}

type Parents {
  father: Father
  mother: Mother
}

type PersonalIdentity {
  type: IdentityType!
  photoUrl: String!
  isValid: Boolean!
  isVerified: Boolean!
}

type College {
  id: ID!
  name: String!
  address: Address!
  course: String!
}

type Currency {
  id: ID!
  name: String!
  code: String!
  symbol: String!
}

type Amenity {
  id: ID!
  name: String!
  details: String!
  pictures: [String]
}

type Review {
  id: ID!
  reviewerId: String!
  ratting: Int!
  title: String!
  description: String!
}

type House {
  id: ID!
  ownerId: String!
  rentPerMonth: Float!
  currency: Currency!
  advanceDeposit: Float!
  amenities: [Amenity]
  review: [Review]
}

type StayTime {
  from: Date!
  till: Date
  isContinue: Boolean!
}

type Signature {
  id: ID!
  publicKey: String!
  userId: String!
  signature: String!
  time: Date!
}

type Receipt {
  id: ID!
  version: Int!
  ownerSignature: Signature
  tenantSignature: Signature
  isOwnerSigned: Boolean!
  isTenantSigned: Boolean!
  print: Print!
}

enum RentCollectionType {
  QUARTERLY,
  MONTHLY,
  CUSTOM,
  YEARLY
}

enum RentCollectionMonth {
  NEXT_MONTH
  CURRENT_MONTH
}

type Print {
  isGenerated: Boolean!
  url: String
  time: Date
}

type RentAgreement {
  id: ID!
  houseId: String!
  userId: String!
  ownerId: String!
  isStaying: Boolean!
  rentCollectedOnDay: String!
  rentCollectionMonth: RentCollectionMonth!
  rentCollectionType: RentCollectionType!
  from: Date!
  end: Date!
  advanceDeposit: Float!
  isAdvancePaid: Boolean!
  rentAmount: Float!
  incrementRatePerYear: Float!
  currency: Currency!
  version: Int!
  ownerSignature: Signature
  tenantSignature: Signature
  isOwnerSigned: Boolean!
  print: Print!
  isTenantSigned: Boolean! 
}

type Rent {
  id: ID!
  userId: String!
  ownerId: String!
  houseId: String!
  rentAmount: Float!
  from: Date!
  rentCollectionType: RentCollectionType!
  upto: Date!
  isLastDayIncluded: Boolean!
  rentCollectedOn: Date
  toBePaidTill: Date!
  currency: Currency!
  receipt: Receipt
  isReceiptGenerated: Boolean!
}

type Tenant implements IUser {
  id: ID!
  name: String!
  email: String!
  emailVerified: Boolean!
  verifiedByAdmin: Boolean!
  parents: Parents
  userRole: [UserRole!]!
  address: Address
  married: Boolean!
  identity: [PersonalIdentity]
  college: College
  stayAt: House
  stayTime: [StayTime]
  rent: [Rent]
  agreement: RentAgreement
  isAgreementDone: Boolean!
  profileUrl: String
}

input SignInInput {
  email: String!
  idToken: String!
}

input SignInWithGoogleInput {
  email: String!
  idToken: String!
}

input SignUpInput {
  name: String!
  phoneNumber: String!
  email: String!
  password: String!
  userRole: UserRole!
}

input SignUpWithGoogleInput {
  name: String!
  email: String!
  profileUrl: String
}

input SignInWithGoogleInput {
  email: String!
  idToken: String!
}

enum AuthSteps {
  SIGN_IN
  SIGN_IN_GOOGLE
  REDIRECT_TO_HOME
  SIGN_UP
  REDIRECT_TO_EMAIL_VERIFICATION
  REDIRECT_TO_PHONE_NUMBER_VERIFICATION
  SIGN_UP_GOOGLE
  REDIRECT_TO_SETUP_PASSWORD_WITH_GOOGLE_SIGNUP
  REDIRECT_TO_PROFILE_UPDATE
}

type AuthStep {
  next: AuthSteps
  previous: AuthSteps
}

type Auth implements IUser {
  id: ID!
  name: String!
  email: String!
  emailVerified: Boolean!
  verifiedByAdmin: Boolean!
  userRole: [UserRole!]!
  profileUrl: String
  token: String!
  refreshToken: String!
  authStep: AuthStep!
}

type Hello {
  id: Int!
  date: Date!
  message: String!
} 

type Query {
  hello: Hello!
}

type Mutation {
  signIn(input: SignInInput!): Auth
  signUp(input: SignUpInput!): Auth
}`
