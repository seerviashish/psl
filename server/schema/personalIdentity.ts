import { Schema, model } from 'mongoose'
import { IdentityType } from '../types'

export interface IPersonalIdentity {
  type: IdentityType
  photoUrl: string
  isValid?: boolean
  isVerified?: boolean
}
export const PersonalIdentitySchema = new Schema<IPersonalIdentity>({
  type: {
    type: String,
    enum: [IdentityType.ADHARCARD, IdentityType.PANCARD],
    required: true,
  },
  photoUrl: { type: String, required: true },
  isValid: { type: Boolean },
  isVerified: { type: Boolean, default: false },
})

const PersonalIdentityModel = model<IPersonalIdentity>(
  'PersonalIdentities',
  PersonalIdentitySchema
)

export default PersonalIdentityModel
