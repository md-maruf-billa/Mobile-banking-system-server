import { Router } from 'express'
import validateRequest from '../../middleware/validateRequest'
import { authValidation } from './auth.validation'
import { authController } from './auth.controller'

const authRoute = Router()

authRoute.post(
  '/login',
  validateRequest(authValidation.loginValidation),
  authController.loginUser
)

export default authRoute
