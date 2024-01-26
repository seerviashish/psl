import { Schema, model } from 'mongoose'

export interface IStayTime {
  from: Date
  till?: Date
  isContinue: boolean
}

export const StayTimeSchema = new Schema<IStayTime>({
  from: { type: Date, required: true },
  till: { type: Date },
  isContinue: { type: Boolean, required: true },
})

const StayTimeModel = model<IStayTime>('StayTimes', StayTimeSchema)

export default StayTimeModel
