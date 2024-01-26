import { Schema, model } from 'mongoose'

export interface ISession {
  client: Schema.Types.ObjectId
  sessionId: string
  tokenId: string
  refreshTokenId: string
  userAgent?: string
  ipv4?: string
  expire: number
  tokenExpire: number
  refreshTokenExpire: number
  createdAt: Date
  userId: Schema.Types.ObjectId
}

export const SessionSchema = new Schema<ISession>(
  {
    client: { type: Schema.Types.ObjectId, required: true, ref: 'Clients' },
    userAgent: { type: String },
    ipv4: { type: String },
    sessionId: { type: String, required: true, unique: true },
    tokenId: { type: String, required: true },
    refreshTokenId: { type: String, required: true, immutable: true },
    userId: { type: Schema.Types.ObjectId, ref: 'Users', require: true },
    tokenExpire: { type: Number, required: true, immutable: true },
    refreshTokenExpire: { type: Number, required: true, immutable: true },
    expire: { type: Number, required: true, immutable: true },
  },
  { timestamps: true }
)

const SessionModel = model<ISession>('Sessions', SessionSchema)

export default SessionModel
