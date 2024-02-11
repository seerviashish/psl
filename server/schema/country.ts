import { Schema, model } from 'mongoose'

export interface ICountry {
  code: string
  name: string
  states?: Schema.Types.ObjectId[]
}

export const CountrySchema = new Schema<ICountry>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  states: {
    type: [{ type: Schema.Types.ObjectId, ref: 'States' }],
    required: false,
    default: [],
  },
})

const CountryModel = model<ICountry>('Countries', CountrySchema)

export default CountryModel
