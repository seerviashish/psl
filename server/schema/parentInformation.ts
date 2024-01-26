import { Schema, model } from 'mongoose'

export interface IParentInformation {
  fatherName?: string
  fatherPhoneNumber?: string
  isVerified: boolean
  motherName?: string
  motherPhoneNumber?: string
}
export const ParentInformationSchema = new Schema<IParentInformation>({
  fatherName: { type: String },
  fatherPhoneNumber: { type: String },
  motherName: { type: String },
  motherPhoneNumber: { type: String },
  isVerified: { type: Boolean, default: false },
})

const ParentInformationModel = model<IParentInformation>(
  'ParentInformation',
  ParentInformationSchema
)

export default ParentInformationModel
