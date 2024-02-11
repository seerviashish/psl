import { Schema, model } from 'mongoose'

export interface IAsTenant {
  address?: Schema.Types.ObjectId
  parents?: Schema.Types.ObjectId
  married: boolean
  identity?: Schema.Types.ObjectId[]
  college?: Schema.Types.ObjectId
  stayAt?: Schema.Types.ObjectId
  stayTime?: Schema.Types.ObjectId[]
  rent?: Schema.Types.ObjectId[]
  agreement?: Schema.Types.ObjectId[]
  isAgreementDone: boolean
  isStaying: boolean
}

export const AsTenantSchema = new Schema<IAsTenant>({
  address: {
    type: Schema.Types.ObjectId,
    ref: 'Addresses',
    required: false,
    default: undefined,
  },
  parents: {
    type: Schema.Types.ObjectId,
    ref: 'ParentInformation',
    required: false,
    default: undefined,
  },
  married: { type: Boolean, required: true },
  identity: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'PersonalIdentities',
      },
    ],
    required: false,
    default: [],
  },
  college: {
    type: Schema.Types.ObjectId,
    ref: 'Colleges',
    required: false,
    default: undefined,
  },
  stayAt: {
    type: Schema.Types.ObjectId,
    ref: 'Houses',
    required: false,
    default: undefined,
  },
  stayTime: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'StayTimes',
      },
    ],
    required: false,
    default: [],
  },
  rent: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Rents',
      },
    ],
    required: false,
    default: [],
  },
  agreement: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'RentAgreements',
      },
    ],
    required: false,
    default: [],
  },
  isAgreementDone: { type: Boolean, required: true, default: false },
  isStaying: { type: Boolean, require: true },
})

const AsTenantModel = model<IAsTenant>('AsTenants', AsTenantSchema)

export default AsTenantModel
