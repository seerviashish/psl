import { Schema, model } from 'mongoose'

export interface IReceipt {
  version: number
  ownerSignature?: Schema.Types.ObjectId
  tenantSignature?: Schema.Types.ObjectId
  isOwnerSigned: boolean
  isTenantSigned: boolean
  print: Schema.Types.ObjectId
}

export const ReceiptSchema = new Schema<IReceipt>({
  version: { type: Number, required: true },
  ownerSignature: {
    type: Schema.Types.ObjectId,
    ref: 'Signatures',
    required: false,
    default: undefined,
  },
  tenantSignature: {
    type: Schema.Types.ObjectId,
    ref: 'Signatures',
    required: false,
    default: undefined,
  },
  isOwnerSigned: { type: Boolean, required: true },
  isTenantSigned: { type: Boolean, required: true },
  print: { type: Schema.Types.ObjectId, ref: 'Prints', require: true },
})

const ReceiptModel = model<IReceipt>('Receipts', ReceiptSchema)

export default ReceiptModel
