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
  let transFee = 0
  if (payload.amount > 100) {
    finalAmount += 5
    transFee += 5
  }
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
    if (Number(isExistUser?.balance) < finalAmount) {
      throw new Error('Insufficient Balance')
    }
    if (amount > 100) {
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
      payType: payload.payType,
      transactionFee: transFee
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

// CASHOUT
const saveCashOutInfoIntoDB = async (
  payload: TTransaction,
  user: JwtPayload
) => {
  const cashOutFee = payload.amount * 0.015 // 1.5% fee
  const agentIncome = payload.amount * 0.01 // 1% for agent
  const adminIncome = payload.amount * 0.005 // 0.5% for admin
  const totalDeduction = payload.amount + cashOutFee

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const isExistUser = await UserModel.isUserExist(user?.userId)
    const isExistAgent = await UserModel.findById(payload.reciverId).session(
      session
    )

    if (!isExistUser || !isExistAgent) {
      throw new Error('User or agent not found!')
    }
    if (isExistAgent.accountType !== 'agent') {
      throw new Error('Cash-out is only possible through an authorized agent.')
    }
    if (!new ObjectId(isExistUser._id).equals(new ObjectId(payload.senderId))) {
      throw new Error('You are not authorized to perform this transaction.')
    }
    if (isNaN(payload.amount) || payload.amount < 50) {
      throw new Error('Amount must be at least 50 TK.')
    }
    if (isExistUser.balance < totalDeduction) {
      throw new Error('Insufficient balance.')
    }

    // Deduct total amount from user
    await UserModel.findByIdAndUpdate(
      payload.senderId,
      { $inc: { balance: -totalDeduction } },
      { session }
    )

    const adminAddableAmount = totalDeduction + agentIncome
    // Add amount to agent's balance
    await UserModel.findByIdAndUpdate(
      payload.reciverId,
      { $inc: { balance: adminAddableAmount } },
      { session }
    )

    // Add admin income (0.5%)
    await UserModel.findOneAndUpdate(
      { accountType: 'admin' },
      { $inc: { balance: adminIncome } },
      { session }
    )

    // Create transaction record
    const transactionData: TTransaction = {
      senderId: new ObjectId(payload.senderId),
      reciverId: new ObjectId(payload.reciverId),
      amount: payload.amount,
      payType: payload.payType,
      transactionFee: cashOutFee
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
  saveSendMoneyInfoIntoDB,
  saveCashOutInfoIntoDB
}
