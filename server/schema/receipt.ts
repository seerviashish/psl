import { Schema, model } from 'mongoose'
import { IPrint, PrintSchema } from './print'
import { ISignature, SignatureSchema } from './signature'

export interface IReceipt {
  version: number
  ownerSignature?: ISignature
  tenantSignature?: ISignature
  isOwnerSigned: boolean
  isTenantSigned: boolean
  print: IPrint
}

export const ReceiptSchema = new Schema<IReceipt>({
  version: { type: Number, required: true },
  ownerSignature: {
    type: SignatureSchema,
    required: false,
    default: undefined,
  },
  tenantSignature: {
    type: SignatureSchema,
    required: false,
    default: undefined,
  },
  isOwnerSigned: { type: Boolean, required: true },
  isTenantSigned: { type: Boolean, required: true },
  print: { type: PrintSchema, require: true },
})

const ReceiptModel = model<IReceipt>('Receipts', ReceiptSchema)

export default ReceiptModel
