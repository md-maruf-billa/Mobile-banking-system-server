import status from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { authService } from './auth.service'

const loginUser = catchAsync(async (req, res) => {
  const result = await authService.loginUserFromDB(req.body)
  const { accessToken, user } = result

  //   res.cookie('refreshToken', refreshToken, {
  //     secure: config.env_type === 'production',
  //     httpOnly: true,
  //     sameSite: config.env_type === 'production' ? 'none' : 'lax',
  //     maxAge: 1000 * 60 * 60 * 24 * 365
  //   })
  sendResponse(res, status.OK, 'User Login Successfully', {
    accessToken,
    user
  })
})

export const authController = {
  loginUser
}
