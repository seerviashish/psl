import { Schema, model } from 'mongoose'

export interface IRent {
  userId: string
  ownerId: string
  houseId: string
  rentAmount: number
  from: Date
  upto: Date
  isLastDayIncluded: boolean
  rentCollectedOn?: Date
  toBePaidTill: Date
  currency: Schema.Types.ObjectId
  receipt?: Schema.Types.ObjectId
  isReceiptGenerated: boolean
}

export const RentSchema = new Schema<IRent>({
  userId: { type: String, required: true },
  ownerId: { type: String, required: true },
  houseId: { type: String, required: true },
  rentAmount: { type: Number, required: true },
  from: { type: Date, required: true },
  upto: { type: Date, required: true },
  isLastDayIncluded: { type: Boolean, required: true },
  rentCollectedOn: { type: Date },
  toBePaidTill: { type: Date },
  currency: { type: Schema.Types.ObjectId, ref: 'Currencies', required: true },
  receipt: {
    type: Schema.Types.ObjectId,
    ref: 'Receipts',
    required: false,
    default: undefined,
  },
  isReceiptGenerated: { type: Boolean, required: true },
})

const RentModel = model<IRent>('Rents', RentSchema)

export default RentModel
