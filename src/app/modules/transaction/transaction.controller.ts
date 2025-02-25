import status from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { transactionService } from './transaction.service'

const sendMoney = catchAsync(async (req, res) => {
  const result = await transactionService.saveSendMoneyInfoIntoDB(
    req.body,
    req?.user
  )
  sendResponse(res, status.OK, 'Send Money successful', result)
})
const cashOut = catchAsync(async (req, res) => {
  const result = await transactionService.saveCashOutInfoIntoDB(
    req.body,
    req?.user
  )
  sendResponse(res, status.OK, 'Cash Out successful', result)
})
const cashIn = catchAsync(async (req, res) => {
  const result = await transactionService.saveCashInInfoIntoDB(
    req.body,
    req?.user
  )
  sendResponse(res, status.OK, 'Cash Out successful', result)
})

export const transactionController = {
  sendMoney,
  cashOut,
  cashIn
}
