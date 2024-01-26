import { Schema, model } from 'mongoose'
import { IState } from './state'

export interface ICountry {
  code: string
  name: string
  states?: IState[]
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
