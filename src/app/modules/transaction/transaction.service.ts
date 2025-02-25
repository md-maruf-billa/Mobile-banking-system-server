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
    // finding sender and reciver information
    const senderInfo = await UserModel.findOne({
      $or: [{ email: payload.senderId }, { mobileNo: payload.senderId }]
    }).session(session)
    const reciverInfo = await UserModel.findOne({
      $or: [{ email: payload.reciverId }, { mobileNo: payload.reciverId }]
    }).session(session)

    if (reciverInfo?.accountType !== 'user') {
      throw new Error('Send Money only possible personal type account')
    }
    if (!senderInfo || !reciverInfo) {
      throw new Error('User not found!!')
    }
    if (new ObjectId(senderInfo._id).equals(new ObjectId(reciverInfo._id))) {
      throw new Error('Transaction to the same account is not possible')
    }
    if (!new ObjectId(senderInfo._id).equals(new ObjectId(payload.senderId))) {
      throw new Error('You are not authorized to access this account')
    }

    const amount = payload?.amount
    if (isNaN(amount) || amount < 50) {
      throw new Error('Amount must be at least 50 TK.')
    }
    if (Number(senderInfo?.balance) < finalAmount) {
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
      senderInfo._id,
      { $inc: { balance: -finalAmount } },
      { session }
    )

    await UserModel.findByIdAndUpdate(
      reciverInfo._id,
      { $inc: { balance: amount } },
      { session }
    )
    const transactionData: TTransaction = {
      senderId: new mongoose.Types.ObjectId(senderInfo._id),
      reciverId: new mongoose.Types.ObjectId(reciverInfo._id),
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
    const userInfo = await UserModel.findOne({
      $or: [{ email: payload.senderId }, { mobileNo: payload.senderId }]
    }).session(session)
    const agentInfo = await UserModel.findOne({
      $or: [{ email: payload.reciverId }, { mobileNo: payload.reciverId }]
    }).session(session)

    if (!userInfo || !agentInfo) {
      throw new Error('User or agent not found!')
    }
    if (agentInfo.accountType !== 'agent') {
      throw new Error('Cash-out is only possible through an authorized agent.')
    }
    if (!new ObjectId(userInfo._id).equals(new ObjectId(payload.senderId))) {
      throw new Error('You are not authorized to perform this transaction.')
    }
    if (new ObjectId(userInfo._id).equals(new ObjectId(agentInfo._id))) {
      throw new Error('Transaction to the same account is not possible')
    }
    if (isNaN(payload.amount) || payload.amount < 50) {
      throw new Error('Amount must be at least 50 TK.')
    }
    if (userInfo.balance < totalDeduction) {
      throw new Error('Insufficient balance.')
    }

    // Deduct total amount from user
    await UserModel.findByIdAndUpdate(
      userInfo._id,
      { $inc: { balance: -totalDeduction } },
      { session }
    )

    const adminAddableAmount = totalDeduction + agentIncome
    // Add amount to agent's balance
    await UserModel.findByIdAndUpdate(
      agentInfo._id,
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
      senderId: new ObjectId(userInfo._id),
      reciverId: new ObjectId(agentInfo._id),
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

// CASH IN
const saveCashInInfoIntoDB = async (
  payload: TTransaction,
  user: JwtPayload
) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const agentInfo = await UserModel.findOne({
      $or: [{ email: payload?.senderId }, { mobileNo: payload?.senderId }]
    })
    const reciverInfo = await UserModel.findOne({
      $or: [{ email: payload?.reciverId }, { mobileNo: payload?.reciverId }]
    })

    if (!reciverInfo || !agentInfo) {
      throw new Error('User or agent not found!')
    }
    if (new ObjectId(reciverInfo._id).equals(new ObjectId(agentInfo._id))) {
      throw new Error('Transaction to the same account is not possible')
    }
    if (reciverInfo.accountType !== 'user') {
      throw new Error('Cash-in must be need a personal account')
    }
    if (isNaN(payload.amount) || payload.amount < 50) {
      throw new Error('Amount must be at least 50 TK.')
    }
    if (agentInfo.balance < payload.amount) {
      throw new Error('Insufficient balance.')
    }
    // Deduct agent balance
    await UserModel.findByIdAndUpdate(
      agentInfo._id,
      { $inc: { totalMoney: -payload.amount } },
      { session }
    )
    // Add balance to the user
    await UserModel.findByIdAndUpdate(
      reciverInfo._id,
      { $inc: { balance: payload.amount } },
      { session }
    )

    // Create transaction record
    const transactionData: TTransaction = {
      senderId: new ObjectId(agentInfo._id),
      reciverId: new ObjectId(reciverInfo._id),
      amount: payload.amount,
      payType: payload.payType,
      transactionFee: 0
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
  saveCashOutInfoIntoDB,
  saveCashInInfoIntoDB
}
