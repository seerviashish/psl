import { Schema, model } from 'mongoose'

export interface IAmenity {
  name: string
  details: string
  pictures?: string[]
}

export const AmenitySchema = new Schema<IAmenity>({
  name: { type: String, required: true },
  details: { type: String, required: true },
  pictures: { type: [String], required: false, default: [] },
})

const AmenityModel = model<IAmenity>('Amenities', AmenitySchema)

export default AmenityModel
