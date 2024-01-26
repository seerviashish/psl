import { Schema, model } from 'mongoose'

export interface IFile {
  name: string
  type: string
}

export const FileSchema = new Schema<IFile>({
  name: { type: String, required: true },
  type: { type: String, required: true },
})

const FileModel = model<IFile>('Files', FileSchema)

export default FileModel
