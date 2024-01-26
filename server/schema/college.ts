import { Schema, model } from 'mongoose'
import { AddressSchema, IAddress } from './address'

export interface ICollege {
  name: string
  address: IAddress
  course: string
}

export const CollegeSchema = new Schema<ICollege>({
  name: { type: String, required: true },
  address: { type: AddressSchema, required: true },
  course: { type: String, required: true },
})

const CollegeModel = model<ICollege>('Colleges', CollegeSchema)

export default CollegeModel
