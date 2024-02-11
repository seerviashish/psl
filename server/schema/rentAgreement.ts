import { Schema, model } from 'mongoose'
import { RentCollectionMonth, RentCollectionType } from '../types'

export interface IRentAgreement {
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
  currency: Schema.Types.ObjectId
  version: number
  ownerSignature?: Schema.Types.ObjectId
  tenantSignature?: Schema.Types.ObjectId
  isOwnerSigned: boolean
  isTenantSigned: boolean
  print: Schema.Types.ObjectId
}

export const RentAgreementSchema = new Schema<IRentAgreement>({
  userId: { type: String, required: true },
  ownerId: { type: String, required: true },
  houseId: { type: String, required: true },
  isStaying: { type: Boolean, required: true },
  rentCollectedOnDay: { type: String, required: true },
  rentCollectionMonth: {
    type: String,
    enum: [RentCollectionMonth.CURRENT_MONTH, RentCollectionMonth.NEXT_MONTH],
    required: true,
    default: RentCollectionMonth.CURRENT_MONTH,
  },
  rentCollectionType: {
    type: String,
    enum: [
      RentCollectionType.QUARTERLY,
      RentCollectionType.CUSTOM,
      RentCollectionType.MONTHLY,
      RentCollectionType.YEARLY,
    ],
    required: true,
    default: RentCollectionType.MONTHLY,
  },
  from: { type: Date, required: true },
  end: { type: Date, required: true },
  advanceDeposit: { type: Number, required: true },
  isAdvancePaid: { type: Boolean, required: true, default: false },
  rentAmount: { type: Number, required: true },
  incrementRatePerYear: { type: Number, required: true },
  currency: { type: Schema.Types.ObjectId, ref: 'Currencies', required: true },
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

const RentAgreementModel = model<IRentAgreement>(
  'RentAgreements',
  RentAgreementSchema
)

export default RentAgreementModel
