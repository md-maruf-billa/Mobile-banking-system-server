import { Router } from 'express'
import auth from '../../middleware/auth'
import validateRequest from '../../middleware/validateRequest'
import { transactionValidations } from './transaction.validation'
import { transactionController } from './transaction.controller'

const transactionRouter = Router()

transactionRouter.post(
  '/send-money',
  auth('user'),
  validateRequest(transactionValidations.sendMoneyValidation),
  transactionController.sendMoney
)
transactionRouter.post(
  '/cash-out',
  auth('user'),
  validateRequest(transactionValidations.cashOutValidation),
  transactionController.cashOut
)
transactionRouter.post(
  '/cash-in',
  auth('agent'),
  validateRequest(transactionValidations.cashInValidation),
  transactionController.cashIn
)

transactionRouter.get(
  '/single-trans/:id',
  auth('admin'),
  transactionController.getSingleTrans
)

export default transactionRouter
