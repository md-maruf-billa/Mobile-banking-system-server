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
  sendResponse(res, status.OK, 'User retirved successfully.', result)
})
const getMyTransaction = catchAsync(async (req, res) => {
  const { userId } = req?.params
  const result = await userService.getMyTransactionFromDB(userId)
  sendResponse(res, status.OK, 'Transaction retirved successfully.', result)
})
const getAllTransaction = catchAsync(async (req, res) => {
  const result = await userService.getAllTransactionFromDB()
  sendResponse(res, status.OK, 'Transaction retirved successfully.', result)
})
const getAllUser = catchAsync(async (req, res) => {
  const result = await userService.getAllUserFromDB()
  sendResponse(res, status.OK, 'Users retirved successfully.', result)
})
const getAllAgent = catchAsync(async (req, res) => {
  const result = await userService.getallAgentFromDB()
  sendResponse(res, status.OK, 'Agent retirved successfully.', result)
})
const updateUserSatatus = catchAsync(async (req, res) => {
  const { userId } = req?.params
  const result = await userService.updateUserStatusIntoDB(userId, req?.body)
  sendResponse(res, status.CREATED, 'User status update successfully.', result)
})

export const userController = {
  createUser,
  getMe,
  getMyTransaction,
  getAllTransaction,
  getAllUser,
  updateUserSatatus,
  getAllAgent
}
