import { Response } from 'express'

const sendResponse = (
  res: Response,
  status: number,
  message: string,
  data: any
) => {
  return res.status(status).json({
    success: true,
    message,
    data
  })
}

export default sendResponse
