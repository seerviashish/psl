import { Schema, model } from 'mongoose'

export interface IPrint {
  isGenerated: boolean
  url?: string
  time?: Date
}

export const PrintSchema = new Schema<IPrint>({
  isGenerated: { type: Boolean, required: true },
  url: { type: String },
  time: { type: Date, required: true },
})

const PrintModel = model<IPrint>('Prints', PrintSchema)

export default PrintModel
