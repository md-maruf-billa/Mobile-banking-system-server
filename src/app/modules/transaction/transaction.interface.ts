import { Types } from 'mongoose'

export type TTransaction = {
  senderId: Types.ObjectId
  reciverId: Types.ObjectId
  amount: number
  ref?: string
  payType: 'Send Money' | 'Cash Out' | 'Cash In'
}
