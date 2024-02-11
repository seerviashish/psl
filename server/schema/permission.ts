import { Schema, model } from 'mongoose'

export interface IPermission {
  for: Schema.Types.ObjectId
  as: number
}

export const PermissionSchema = new Schema<IPermission>({
  for: { type: Schema.Types.ObjectId, ref: 'Features', required: true },
  as: { type: Number, required: true },
})

const PermissionModel = model<IPermission>('Permissions', PermissionSchema)

export default PermissionModel
