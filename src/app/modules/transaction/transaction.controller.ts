import status from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { transactionService } from './transaction.service'

const setMoney = catchAsync(async (req, res) => {
  const result = await transactionService.saveSendMoneyInfoIntoDB(
    req.body,
    req?.user
  )
  sendResponse(res, status.OK, 'Send Money successful', result)
})

export const transactionController = {
  setMoney
}
