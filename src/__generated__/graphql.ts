/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
};

export type Address = {
  __typename?: 'Address';
  city: Scalars['String']['output'];
  country: Country;
  name: Scalars['String']['output'];
  number: Scalars['String']['output'];
  postalCode: Scalars['String']['output'];
  state: State;
  street?: Maybe<Scalars['String']['output']>;
};

export type Amenity = {
  __typename?: 'Amenity';
  details: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  pictures?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type Auth = IUser & {
  __typename?: 'Auth';
  authStep: AuthStep;
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  profileUrl?: Maybe<Scalars['String']['output']>;
  refreshToken: Scalars['String']['output'];
  token: Scalars['String']['output'];
  userRole: Array<UserRole>;
  verifiedByAdmin: Scalars['Boolean']['output'];
};

export type AuthStep = {
  __typename?: 'AuthStep';
  next?: Maybe<AuthSteps>;
  previous?: Maybe<AuthSteps>;
};

export enum AuthSteps {
  RedirectToEmailVerification = 'REDIRECT_TO_EMAIL_VERIFICATION',
  RedirectToHome = 'REDIRECT_TO_HOME',
  RedirectToPhoneNumberVerification = 'REDIRECT_TO_PHONE_NUMBER_VERIFICATION',
  RedirectToProfileUpdate = 'REDIRECT_TO_PROFILE_UPDATE',
  RedirectToSetupPasswordWithGoogleSignup = 'REDIRECT_TO_SETUP_PASSWORD_WITH_GOOGLE_SIGNUP',
  SignIn = 'SIGN_IN',
  SignInGoogle = 'SIGN_IN_GOOGLE',
  SignUp = 'SIGN_UP',
  SignUpGoogle = 'SIGN_UP_GOOGLE'
}

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type College = {
  __typename?: 'College';
  address: Address;
  course: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Country = {
  __typename?: 'Country';
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Currency = {
  __typename?: 'Currency';
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  symbol: Scalars['String']['output'];
};

export type Father = ParentInformation & {
  __typename?: 'Father';
  name: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
};

export type Hello = {
  __typename?: 'Hello';
  date: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  message: Scalars['String']['output'];
};

export type House = {
  __typename?: 'House';
  advanceDeposit: Scalars['Float']['output'];
  amenities?: Maybe<Array<Maybe<Amenity>>>;
  currency: Currency;
  id: Scalars['ID']['output'];
  ownerId: Scalars['String']['output'];
  rentPerMonth: Scalars['Float']['output'];
  review?: Maybe<Array<Maybe<Review>>>;
};

export type IUser = {
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  profileUrl?: Maybe<Scalars['String']['output']>;
  userRole: Array<UserRole>;
  verifiedByAdmin: Scalars['Boolean']['output'];
};

export enum IdentityType {
  Adharcard = 'ADHARCARD',
  Pancard = 'PANCARD'
}

export type Mother = ParentInformation & {
  __typename?: 'Mother';
  name: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  signIn?: Maybe<Auth>;
  signUp?: Maybe<Auth>;
};


export type MutationSignInArgs = {
  input: SignInInput;
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};

export type ParentInformation = {
  name: Scalars['String']['output'];
  phoneNumber: Scalars['String']['output'];
};

export type Parents = {
  __typename?: 'Parents';
  father?: Maybe<Father>;
  mother?: Maybe<Mother>;
};

export type PersonalIdentity = {
  __typename?: 'PersonalIdentity';
  isValid: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  photoUrl: Scalars['String']['output'];
  type: IdentityType;
};

export type PhoneNumber = {
  __typename?: 'PhoneNumber';
  id: Scalars['ID']['output'];
  isVerified: Scalars['Boolean']['output'];
  phoneNumber: Scalars['String']['output'];
};

export type Print = {
  __typename?: 'Print';
  isGenerated: Scalars['Boolean']['output'];
  time?: Maybe<Scalars['Date']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  hello: Hello;
};

export type Receipt = {
  __typename?: 'Receipt';
  id: Scalars['ID']['output'];
  isOwnerSigned: Scalars['Boolean']['output'];
  isTenantSigned: Scalars['Boolean']['output'];
  ownerSignature?: Maybe<Signature>;
  print: Print;
  tenantSignature?: Maybe<Signature>;
  version: Scalars['Int']['output'];
};

export type Rent = {
  __typename?: 'Rent';
  currency: Currency;
  from: Scalars['Date']['output'];
  houseId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isLastDayIncluded: Scalars['Boolean']['output'];
  isReceiptGenerated: Scalars['Boolean']['output'];
  ownerId: Scalars['String']['output'];
  receipt?: Maybe<Receipt>;
  rentAmount: Scalars['Float']['output'];
  rentCollectedOn?: Maybe<Scalars['Date']['output']>;
  rentCollectionType: RentCollectionType;
  toBePaidTill: Scalars['Date']['output'];
  upto: Scalars['Date']['output'];
  userId: Scalars['String']['output'];
};

export type RentAgreement = {
  __typename?: 'RentAgreement';
  advanceDeposit: Scalars['Float']['output'];
  currency: Currency;
  end: Scalars['Date']['output'];
  from: Scalars['Date']['output'];
  houseId: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  incrementRatePerYear: Scalars['Float']['output'];
  isAdvancePaid: Scalars['Boolean']['output'];
  isOwnerSigned: Scalars['Boolean']['output'];
  isStaying: Scalars['Boolean']['output'];
  isTenantSigned: Scalars['Boolean']['output'];
  ownerId: Scalars['String']['output'];
  ownerSignature?: Maybe<Signature>;
  print: Print;
  rentAmount: Scalars['Float']['output'];
  rentCollectedOnDay: Scalars['String']['output'];
  rentCollectionMonth: RentCollectionMonth;
  rentCollectionType: RentCollectionType;
  tenantSignature?: Maybe<Signature>;
  userId: Scalars['String']['output'];
  version: Scalars['Int']['output'];
};

export enum RentCollectionMonth {
  CurrentMonth = 'CURRENT_MONTH',
  NextMonth = 'NEXT_MONTH'
}

export enum RentCollectionType {
  Custom = 'CUSTOM',
  Monthly = 'MONTHLY',
  Quarterly = 'QUARTERLY',
  Yearly = 'YEARLY'
}

export type Review = {
  __typename?: 'Review';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  ratting: Scalars['Int']['output'];
  reviewerId: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type SignInInput = {
  email: Scalars['String']['input'];
  idToken: Scalars['String']['input'];
};

export type SignInWithGoogleInput = {
  email: Scalars['String']['input'];
  idToken: Scalars['String']['input'];
};

export type SignUpInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
  userRole: UserRole;
};

export type SignUpWithGoogleInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  profileUrl?: InputMaybe<Scalars['String']['input']>;
};

export type Signature = {
  __typename?: 'Signature';
  id: Scalars['ID']['output'];
  publicKey: Scalars['String']['output'];
  signature: Scalars['String']['output'];
  time: Scalars['Date']['output'];
  userId: Scalars['String']['output'];
};

export type State = {
  __typename?: 'State';
  code: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type StayTime = {
  __typename?: 'StayTime';
  from: Scalars['Date']['output'];
  isContinue: Scalars['Boolean']['output'];
  till?: Maybe<Scalars['Date']['output']>;
};

export type Tenant = IUser & {
  __typename?: 'Tenant';
  address?: Maybe<Address>;
  agreement?: Maybe<RentAgreement>;
  college?: Maybe<College>;
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  identity?: Maybe<Array<Maybe<PersonalIdentity>>>;
  isAgreementDone: Scalars['Boolean']['output'];
  married: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  parents?: Maybe<Parents>;
  profileUrl?: Maybe<Scalars['String']['output']>;
  rent?: Maybe<Array<Maybe<Rent>>>;
  stayAt?: Maybe<House>;
  stayTime?: Maybe<Array<Maybe<StayTime>>>;
  userRole: Array<UserRole>;
  verifiedByAdmin: Scalars['Boolean']['output'];
};

export type User = IUser & {
  __typename?: 'User';
  address?: Maybe<Address>;
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  profileUrl?: Maybe<Scalars['String']['output']>;
  userRole: Array<UserRole>;
  verifiedByAdmin: Scalars['Boolean']['output'];
};

export enum UserRole {
  Admin = 'ADMIN',
  Owner = 'OWNER',
  Tenant = 'TENANT',
  User = 'USER'
}

export type SignUpMutationVariables = Exact<{
  input: SignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp?: { __typename?: 'Auth', id: string, name: string, email: string, emailVerified: boolean, verifiedByAdmin: boolean, profileUrl?: string | null, userRole: Array<UserRole>, token: string, refreshToken: string, authStep: { __typename?: 'AuthStep', next?: AuthSteps | null, previous?: AuthSteps | null } } | null };


export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"verifiedByAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"authStep"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"next"}},{"kind":"Field","name":{"kind":"Name","value":"previous"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profileUrl"}},{"kind":"Field","name":{"kind":"Name","value":"userRole"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;