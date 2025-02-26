import express, { Request, Response } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import globalErrorHandler from './app/errors/globalErrorHandler'
import userRoute from './app/modules/user/user.route'
import authRoute from './app/modules/auth/auth.route'
import transactionRouter from './app/modules/transaction/transaction.route'
const app = express()

// Middleware
app.use(cookieParser())
app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
)

// use express router
app.use('/user', userRoute)
app.use('/auth', authRoute)
app.use('/transaction', transactionRouter)

// default route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    message: 'Server is successfully running 🏃‍➡️🏃‍➡️🏃‍➡️'
  })
})

app.use(globalErrorHandler)
// export app for server.ts page can easily access
export default app
