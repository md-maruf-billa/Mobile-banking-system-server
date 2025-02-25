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
  transactionController.setMoney
)

export default transactionRouter
