import status from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { userService } from './user.service'

const createUser = catchAsync(async (req, res) => {
  const result = await userService.saveUserDataIntoDB(req?.body)
  sendResponse(res, status.CREATED, 'User created successfully.', result)
})

export const userController = {
  createUser
}
