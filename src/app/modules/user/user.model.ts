import { model, Schema } from 'mongoose'
import { TUser, UserInterfaceModel } from './user.interface'

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    mobileNo: {
      type: String,
      required: true
    },
    pin: {
      type: String,
      required: true
    },
    nid: {
      type: String,
      required: true
    },
    accountType: {
      type: String,
      enum: ['admin', 'agent', 'user'],
      required: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

//  creating user model
userSchema.statics.isUserExist = async function (
  payload: string
): Promise<TUser | null> {
  return this.findOne({
    $or: [{ email: payload }, { mobileNo: payload }]
  })
}

export const UserModel = model<TUser, UserInterfaceModel>('user', userSchema)
