import { Schema, model } from 'mongoose'

export interface IHouse {
  ownerId: string
  rentPerMonth: number
  currency: Schema.Types.ObjectId
  advanceDeposit: number
  amenities?: Schema.Types.ObjectId[]
  review?: Schema.Types.ObjectId[]
}
export const HouseSchema = new Schema<IHouse>({
  ownerId: { type: String, required: true },
  rentPerMonth: { type: Number, required: true },
  currency: { type: Schema.Types.ObjectId, ref: 'Currencies', required: true },
  advanceDeposit: { type: Number, required: true },
  amenities: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Amenities',
      },
    ],
    required: false,
    default: [],
  },
  review: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Reviews',
      },
    ],
    required: false,
    default: [],
  },
})

const HouseModel = model<IHouse>('Houses', HouseSchema)

export default HouseModel
