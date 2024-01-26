import { Schema, model } from 'mongoose'
import { ICountry } from './country'
import { IState } from './state'

export interface IAddress {
  name: string
  number: string
  street: string
  state: IState
  city: string
  country: ICountry
  postalCode: string
}

export const AddressSchema = new Schema<IAddress>({
  name: { type: String, required: true },
  number: { type: String, required: true },
  street: { type: String, required: true },
  state: { type: Schema.Types.ObjectId, ref: 'States', required: true },
  country: { type: Schema.Types.ObjectId, ref: 'Countries', required: true },
  postalCode: { type: String, required: true },
})

const AddressModel = model<IAddress>('Addresses', AddressSchema)

export default AddressModel
