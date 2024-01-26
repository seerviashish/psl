import { Schema, model } from 'mongoose'
import { AmenitySchema, IAmenity } from './amenity'
import { ICurrency } from './currency'
import { IReview, ReviewSchema } from './review'

export interface IHouse {
  ownerId: string
  rentPerMonth: number
  currency: ICurrency
  advanceDeposit: number
  amenities?: IAmenity[]
  review?: IReview[]
}
export const HouseSchema = new Schema<IHouse>({
  ownerId: { type: String, required: true },
  rentPerMonth: { type: Number, required: true },
  currency: { type: Schema.Types.ObjectId, ref: 'Currencies', required: true },
  advanceDeposit: { type: Number, required: true },
  amenities: { type: [AmenitySchema], required: false, default: [] },
  review: { type: [ReviewSchema], required: false, default: [] },
})

const HouseModel = model<IHouse>('Houses', HouseSchema)

export default HouseModel
