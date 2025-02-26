import { model, Schema } from 'mongoose'
import { TTransaction } from './transaction.interface'

const transactionSchema = new Schema<TTransaction>(
  {
    senderId: {
      type: String,
      required: true,
      ref: 'user'
    },
    reciverId: {
      type: String,
      required: true,
      ref: 'user'
    },
    amount: {
      type: Number,
      required: true
    },
    ref: {
      type: String,
      required: false
    },
    transactionFee: {
      type: Number,
      required: true
    },
    pin: {
      type: String,
      required: false
    },
    payType: {
      type: String,
      required: true,
      enum: ['Send Money', 'Cash Out', 'Cash In']
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export const TransactionModel = model<TTransaction>(
  'Transaction',
  transactionSchema
)
