import { Schema, model } from 'mongoose'

export interface IReview {
  reviewerId?: string
  ratting: number
  title: string
  description: string
  picturesUrls?: string[]
}

export const ReviewSchema = new Schema<IReview>({
  reviewerId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  ratting: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  picturesUrls: { type: [String], required: false, default: [] },
})

const ReviewModel = model<IReview>('Reviews', ReviewSchema)

export default ReviewModel
