import status from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { authService } from './auth.service'
import config from '../../config'

const loginUser = catchAsync(async (req, res) => {
  const result = await authService.loginUserFromDB(req.body)
  const { accessToken, user } = result

  // res.cookie('token', accessToken, {
  //   // secure: config.env_type === 'production',
  //   secure: false,
  //   httpOnly: true,
  //   // sameSite: config.env_type === 'production' ? 'none' : 'lax',
  //   sameSite: 'lax',
  //   maxAge: 1000 * 60 * 60 * 24 * 365
  // })
  res.cookie('token', accessToken, {
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365
  })
  sendResponse(res, status.OK, 'User Login Successfully', {
    accessToken,
    user
  })
})

export const authController = {
  loginUser
}
