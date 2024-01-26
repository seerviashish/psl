import { Schema, model } from 'mongoose'
import { UserRole } from '../types'
import { AddressSchema, IAddress } from './address'
import { CollegeSchema, ICollege } from './college'
import { HouseSchema, IHouse } from './house'
import {
  IParentInformation,
  ParentInformationSchema,
} from './parentInformation'
import { IPermission, PermissionSchema } from './permission'
import { IPersonalIdentity, PersonalIdentitySchema } from './personalIdentity'
import { IRent, RentSchema } from './rent'
import { IRentAgreement, RentAgreementSchema } from './rentAgreement'
import { IStayTime, StayTimeSchema } from './stayTime'

export interface IAsTenant {
  name: string
  email: string
  phoneNumber?: string
  emailVerified: boolean
  verifiedByAdmin: boolean
  userRole: UserRole[]
  permissions?: IPermission[]
  profileUrl?: string
  address?: IAddress
  parents?: IParentInformation
  married: boolean
  identity?: IPersonalIdentity[]
  college?: ICollege
  stayAt?: IHouse
  stayTime?: IStayTime[]
  rent?: IRent[]
  agreement?: IRentAgreement[]
  isAgreementDone: boolean
}

export const AsTenantSchema = new Schema<IAsTenant>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String },
  emailVerified: { type: Boolean, required: true, default: false },
  verifiedByAdmin: { type: Boolean, required: true, default: false },
  userRole: {
    type: [String],
    required: true,
    enum: [UserRole.ADMIN, UserRole.OWNER, UserRole.TENANT, UserRole.USER],
    default: [UserRole.USER],
  },
  permissions: {
    type: [PermissionSchema],
    required: false,
    default: [],
  },
  profileUrl: { type: String },
  address: { type: AddressSchema, required: false, default: undefined },
  parents: {
    type: ParentInformationSchema,
    required: false,
    default: undefined,
  },
  married: { type: Boolean, required: true },
  identity: { type: [PersonalIdentitySchema], required: false, default: [] },
  college: { type: CollegeSchema, required: false, default: undefined },
  stayAt: { type: HouseSchema, required: false, default: undefined },
  stayTime: { type: [StayTimeSchema], required: false, default: [] },
  rent: { type: [RentSchema], required: false, default: [] },
  agreement: { type: [RentAgreementSchema], required: false, default: [] },
  isAgreementDone: { type: Boolean, required: true, default: false },
})

const AsTenantModel = model<IAsTenant>('AsTenants', AsTenantSchema)

export default AsTenantModel
