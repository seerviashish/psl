// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "User" type defines the queryable fields for every User in our data source.
  scalar Date

  enum UserRole {
    USER
    OWNER
    TENANT
    ADMIN
  }

  enum PersonalIdentity {
    ADHARCARD
    PANCARD
  }

  interface IUser {
    id: ID!
    name: String!
    email: String!
    phoneNumber: String!
  }

  type User implements IUser {
    id: ID!
    name: String!
    email: String!
    phoneNumber: String!
    isEmailVerified: Boolean!
    isVerifiedByAdmin: Boolean!
    role: UserRole!
  }

  type Owner implements IUser {
    id: ID!
    name: String!
    email: String!
    phoneNumber: String!
  }

  type Tenant implements IUser {
    id: ID!
    name: String!
    email: String!
    phoneNumber: String!
    fatherName: String!
    fatherPhoneNumber: String!
    personalId: PersonalIdentity!
    personalIdNumber: String!
    permanentAddress: String!
    course: String!
    college: String!
    roomNumber: Int
    rentPaidTill: Date
    stayFrom: Date
  }

  input SignInInput {
    email: String!
    password: String!
  }

  input SignUpInput {
    name: String!
    phoneNumber: String!
    email: String!
    password: String!
    role: UserRole!
  }

  input SignInWithGoogleInput {
    idToken: String!
  }

  input TenantUpdateInput {
    tenantId: String!
    name: String
    phoneNumber: String
    fatherName: String
    fatherPhoneNumber: String
    personalId: PersonalIdentity
    personalIdNumber: String
    permanentAddress: String
    course: String
    college: String
    roomNumber: Int
    rentPaidTill: Date
    stayFrom: Date
  }

  input TenantCreateInput {
    name: String
    email: String
    phoneNumber: String
    fatherName: String
    fatherPhoneNumber: String
    personalId: PersonalIdentity
    personalIdNumber: String
    permanentAddress: String
    course: String
    college: String
    roomNumber: Int
    rentPaidTill: Date
    stayFrom: Date
  }

  type Auth implements IUser {
    id: ID!
    name: String!
    email: String!
    phoneNumber: String!
    isEmailVerified: Boolean!
    isVerifiedByAdmin: Boolean!
    role: UserRole!
    token: String
  }

  enum ActionStatus {
    SUCCESS
    FAILED
    PENDING
  }

  type ActionResponse {
    status: ActionStatus
    message: String
  }

  input TenantRoomRequest {
    roomNumber: Int
    roomOwnerId: String 
  }

  type Query {
    getTenants(offset: Int = 0, limit: Int = 10): [Tenant]
    getTenant(id: ID!): Tenant
    getOwners(offset: Int = 0, limit: Int = 10): [Owner]
    getUsers(offset: Int = 0, limit: Int = 10): [User]
    verifyUser: ActionResponse
  }

  type Mutation {
    signIn(input: SignInInput!): Auth
    signUp(input: SignUpInput!): Auth
    updateTenantDetails(input: TenantUpdateInput!): Tenant
    deleteTenant(id: ID!): ActionResponse
    addTenant(input: TenantCreateInput!): ActionResponse
    requestForRoom(input: TenantRoomRequest!): ActionResponse    
  }

  # enum NotificationEvent {
  #   EMAIL_VERIFICATION
  # }

  # type Notification {
  #   event: NotificationEvent!,
  #   payload: Object,
  # }

  # type Subscription {
  #   notification: Notification 
  # }
`
