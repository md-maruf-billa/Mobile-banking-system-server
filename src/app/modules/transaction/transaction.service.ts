import { JwtPayload } from 'jsonwebtoken'
import { TTransaction } from './transaction.interface'
import { UserModel } from '../user/user.model'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import { TransactionModel } from './transaction.model'

const saveSendMoneyInfoIntoDB = async (
  payload: TTransaction,
  user: JwtPayload
) => {
  let finalAmount = payload.amount
  const session = await mongoose.startSession() // Start transaction session
  session.startTransaction()

  try {
    const isExistUser = await UserModel.isUserExist(user.userId)
    const isExistReciver = await UserModel.findById(payload.reciverId)
    if (isExistReciver?.accountType !== 'user') {
      throw new Error('Send Money only possible personal account not agent')
    }
    if (!isExistUser || !isExistReciver) {
      throw new Error('User not found!!')
    }
    if (
      new ObjectId(isExistUser._id).equals(new ObjectId(isExistReciver._id))
    ) {
      throw new Error('Transaction to the same account is not possible')
    }
    if (!new ObjectId(isExistUser._id).equals(new ObjectId(payload.senderId))) {
      throw new Error('You are not authorized to access this account')
    }

    const amount = payload?.amount
    if (isNaN(amount) || amount < 50) {
      throw new Error('Amount must be at least 50 TK.')
    }
    if (Number(isExistUser?.balance) < amount) {
      throw new Error('Insufficient Balance')
    }
    if (amount > 100) {
      finalAmount += 5
      await UserModel.findOneAndUpdate(
        { accountType: 'admin' },
        { $inc: { balance: 5 } },
        { session }
      )
    }

    //  Deduct balance from sender
    await UserModel.findByIdAndUpdate(
      payload.senderId,
      { $inc: { balance: -finalAmount } },
      { session }
    )

    await UserModel.findByIdAndUpdate(
      payload.reciverId,
      { $inc: { balance: amount } },
      { session }
    )
    const transactionData: TTransaction = {
      senderId: new mongoose.Types.ObjectId(payload.senderId),
      reciverId: new mongoose.Types.ObjectId(payload.reciverId),
      amount: payload.amount,
      payType: payload.payType
    }

    const result = await TransactionModel.create(transactionData)
    await session.commitTransaction()
    session.endSession()
    return result
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}

export const transactionService = {
  saveSendMoneyInfoIntoDB
}
