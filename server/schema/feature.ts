import { Schema, model } from 'mongoose'

export interface IFeature {
  name: string
  description: string
  code: string
  dependsOn?: string[]
}

export const FeatureSchema = new Schema<IFeature>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  dependsOn: { type: [String] },
})

const FeatureModel = model<IFeature>('Features', FeatureSchema)

export default FeatureModel
