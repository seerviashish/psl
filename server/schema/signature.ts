import { Schema, model } from 'mongoose'

export interface ISignature {
  publicKey: string
  userId: string
  signature: string
  time: Date
}

export const SignatureSchema = new Schema<ISignature>(
  {
    publicKey: { type: String, required: true },
    userId: { type: String, required: true },
    signature: { type: String, required: true },
    time: { type: Date, required: true },
  },
  { timestamps: true }
)

const SignatureModel = model<ISignature>('Signatures', SignatureSchema)

export default SignatureModel
