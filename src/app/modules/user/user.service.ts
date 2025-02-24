import { TUser } from './user.interface'
import { UserModel } from './user.model'

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

  // Create a new user if no duplicate is found
  return await UserModel.create(payload)
}

export const userService = {
  saveUserDataIntoDB
}
