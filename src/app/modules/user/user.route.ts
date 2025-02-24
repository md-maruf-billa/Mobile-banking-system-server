import { Router } from 'express'
import validateRequest from '../../middleware/validateRequest'
import { userValidations } from './user.validation'
import { userController } from './user.controller'

const userRoute = Router()

userRoute.post(
  '/',
  validateRequest(userValidations.createUserValidationSchema),
  userController.createUser
)

export default userRoute
