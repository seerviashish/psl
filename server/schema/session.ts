import { WithId } from 'mongodb'
import { Schema, model } from 'mongoose'

export interface ISession {
  client: Schema.Types.ObjectId
  sessionId: string
  tokenId: string
  refreshTokenId: string
  userAgent?: string
  appId: string
  ipv4?: string
  expire?: number
  tokenExpire: number
  refreshTokenExpire: number
  createdAt?: Date
  updatedAt?: Date
  userId: Schema.Types.ObjectId
}
const SESSION_EXPIRE_TIME = 60 * 10 // in seconds

export const SessionSchema = new Schema<ISession>(
  {
    client: { type: Schema.Types.ObjectId, required: true, ref: 'Clients' },
    userAgent: { type: String },
    ipv4: { type: String },
    appId: { type: String, require: true },
    sessionId: { type: String, required: true, unique: true },
    tokenId: { type: String, required: true },
    refreshTokenId: { type: String, required: true, immutable: true },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', require: true },
    tokenExpire: { type: Number, required: true, immutable: true },
    refreshTokenExpire: { type: Number, required: true, immutable: true },
    expire: {
      type: Number,
      required: false,
      immutable: true,
      default: SESSION_EXPIRE_TIME,
    },
  },
  {
    timestamps: true,
  }
)

SessionSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: SESSION_EXPIRE_TIME }
)

const SessionModel = model<ISession>('Sessions', SessionSchema)

export type ISessionDocument = ISession & WithId<Document>

export default SessionModel
