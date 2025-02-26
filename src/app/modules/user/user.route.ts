import { Router } from 'express'
import validateRequest from '../../middleware/validateRequest'
import { userValidations } from './user.validation'
import { userController } from './user.controller'
import auth from '../../middleware/auth'

const userRoute = Router()

userRoute.post(
  '/',
  validateRequest(userValidations.createUserValidationSchema),
  userController.createUser
)

userRoute.get('/:userId', auth('admin', 'agent', 'user'), userController.getMe)
userRoute.get(
  '/my-transaction/:userId',
  auth('admin', 'agent', 'user'),
  userController.getMyTransaction
)

export default userRoute
