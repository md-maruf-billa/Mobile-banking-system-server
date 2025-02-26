import { Router } from 'express'
import validateRequest from '../../middleware/validateRequest'
import { userValidations } from './user.validation'
import { userController } from './user.controller'
import auth from '../../middleware/auth'

const userRoute = Router()
userRoute.get('/all-user-admin', userController.getAllUser)

userRoute.get(
  '/all-transaction',
  auth('admin'),
  userController.getAllTransaction
)
userRoute.get('/all-agent', auth('admin'), userController.getAllAgent)

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

userRoute.patch(
  '/update-status/:userId',
  auth('admin'),
  userController.updateUserSatatus
)

export default userRoute
