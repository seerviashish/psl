import { Schema, model } from 'mongoose'

export interface ICurrency {
  code: string
  name: string
  symbol: string
}

export const CurrencySchema = new Schema<ICurrency>({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  code: { type: String, required: true, unique: true },
})

const CurrencyModel = model<ICurrency>('Currencies', CurrencySchema)

export default CurrencyModel
