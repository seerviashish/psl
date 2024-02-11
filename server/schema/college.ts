import { Schema, model } from 'mongoose'

export interface ICollege {
  name: string
  address: Schema.Types.ObjectId
  course: string
}

export const CollegeSchema = new Schema<ICollege>({
  name: { type: String, required: true },
  address: { type: Schema.Types.ObjectId, ref: 'Addresses', required: true },
  course: { type: String, required: true },
})

const CollegeModel = model<ICollege>('Colleges', CollegeSchema)

export default CollegeModel
