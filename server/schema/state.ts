import { Schema, model } from 'mongoose'

export interface IState {
  code: string
  name: string
}

export const StateSchema = new Schema<IState>({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
})

const StateModel = model<IState>('States', StateSchema)

export default StateModel
