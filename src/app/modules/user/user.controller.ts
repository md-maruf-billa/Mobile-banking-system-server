import status from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { userService } from './user.service'

const createUser = catchAsync(async (req, res) => {
  const result = await userService.saveUserDataIntoDB(req?.body)
  sendResponse(res, status.CREATED, 'User created successfully.', result)
})
const getMe = catchAsync(async (req, res) => {
  const { userId } = req?.params
  const result = await userService.getMeFromDB(userId)
  sendResponse(res, status.CREATED, 'User retirved successfully.', result)
})
const getMyTransaction = catchAsync(async (req, res) => {
  const { userId } = req?.params
  const result = await userService.getMyTransactionFromDB(userId)
  sendResponse(
    res,
    status.CREATED,
    'Transaction retirved successfully.',
    result
  )
})

export const userController = {
  createUser,
  getMe,
  getMyTransaction
}
