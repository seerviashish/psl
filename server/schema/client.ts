import { Schema, model } from 'mongoose'

export interface IClient {
  name: string
  key: string
  createdAt?: Date
  updatedAt?: Date
  enabled?: boolean
}

export const ClientSchema = new Schema<IClient>(
  {
    name: { type: String, required: true },
    key: { type: String, required: true },
    enabled: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const ClientModel = model<IClient>('Clients', ClientSchema)

export default ClientModel
