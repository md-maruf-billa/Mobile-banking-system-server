import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import globalErrorHandler from './app/errors/globalErrorHandler'
import userRoute from './app/modules/user/user.route'
const app = express()

// Middleware
app.use(express.json())
app.use(express.raw())
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true
  })
)
app.use(cookieParser())
// use express router
app.use('/user', userRoute)
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    message: 'Server is successfully running 🏃‍➡️🏃‍➡️🏃‍➡️'
  })
})

app.use(globalErrorHandler)
// export app for server.ts page can easily access
export default app
