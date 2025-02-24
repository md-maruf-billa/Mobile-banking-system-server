import { UserModel } from '../user/user.model'
import { TLogin } from './auth.interface'
import bcrypt from 'bcrypt'
import { createToken } from './auth.utils'
import config from '../../config'
import ms from 'ms'

const loginUserFromDB = async (payload: TLogin) => {
  const isUserExist = await UserModel.isUserExist(payload.email!)
  if (!isUserExist) {
    throw new Error('User not found')
  }
  if (isUserExist.isDeleted) {
    throw new Error('User is deleted')
  }
  const isPasswordMatch = bcrypt.compareSync(payload.pin, isUserExist.pin)
  if (!isPasswordMatch) {
    throw new Error('Incrrect Password')
  }
  const jwtPayload = {
    userId: isUserExist.email,
    role: isUserExist.accountType
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as ms.StringValue
  )

  isUserExist.pin = ''
  return {
    accessToken,
    user: isUserExist
  }
}

export const authService = {
  loginUserFromDB
}
