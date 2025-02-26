import config from '../../config'
import { TransactionModel } from '../transaction/transaction.model'
import { TUser } from './user.interface'
import { UserModel } from './user.model'
import bcrypt from 'bcrypt'

const saveUserDataIntoDB = async (payload: TUser) => {
  // Check if the user already exists
  const existingUser = await UserModel.findOne({
    $or: [
      { email: payload.email },
      { mobileNo: payload.mobileNo },
      { nid: payload.nid }
    ]
  })

  if (existingUser) {
    let errorMessage = 'User data already exists'

    if (existingUser.email === payload.email) {
      errorMessage = 'Email already exists'
    } else if (existingUser.mobileNo === payload.mobileNo) {
      errorMessage = 'Mobile number already exists'
    } else if (existingUser.nid === payload.nid) {
      errorMessage = 'NID already exists'
    }

    throw new Error(errorMessage)
  }

  // hash password for sucurey
  const hasPin = bcrypt.hashSync(payload?.pin, Number(config.bycript_solt))
  // add bonus indivisul account
  let bonus = ''
  let accountStatus = true
  if (payload.accountType == 'user') {
    bonus = '40'
  }
  if (payload.accountType == 'agent') {
    bonus = '100000'
    accountStatus = false
  }
  if (payload.accountType == 'admin') {
    bonus = '1000000'
  }

  // Create a new user if no duplicate is found
  return await UserModel.create({
    ...payload,
    pin: hasPin,
    balance: bonus,
    isActive: accountStatus
  })
}

const getMeFromDB = async (userId: string) => {
  let totalMoney = 0

  // Find the user either by email or mobile number
  const existingUser = await UserModel.findOne({
    $or: [{ email: userId }, { mobileNo: userId }]
  })

  if (!existingUser) {
    throw new Error('User not found')
  }

  if (existingUser.accountType === 'admin') {
    const data = await UserModel.find({
      $or: [{ accountType: 'user' }, { accountType: 'agent' }]
    })

    totalMoney = data.reduce((acc, prev) => acc + (prev.balance || 0), 0)
  }
  return { ...existingUser.toObject(), totalMoney }
}
const getMyTransactionFromDB = async (userId: string) => {
  // Find the user either by email or mobile number
  const existingUser = await UserModel.findOne({
    $or: [{ email: userId }, { mobileNo: userId }]
  })
  if (!existingUser) {
    throw new Error('User not found')
  }
  const res = await TransactionModel.find({
    senderId: existingUser._id
  })
    .populate(['reciverId'])
    .sort({ createdAt: -1 })
  return res
}

export const userService = {
  saveUserDataIntoDB,
  getMeFromDB,
  getMyTransactionFromDB
}
