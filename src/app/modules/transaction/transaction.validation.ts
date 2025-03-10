import { z } from 'zod'

const sendMoneyValidation = z.object({
  senderId: z.string().min(1, 'Sender ID is required'),
  reciverId: z.string().min(1, 'Receiver ID is required'),
  amount: z.number(),
  pin: z.string(),
  ref: z.string().optional(), // Reference is optional
  payType: z.enum(['Send Money'])
})
const cashOutValidation = z.object({
  senderId: z.string().min(1, 'Sender ID is required'),
  reciverId: z.string().min(1, 'Receiver ID is required'),
  amount: z.number(),
  pin: z.string(),
  ref: z.string().optional(), // Reference is optional
  payType: z.enum(['Cash Out'])
})
const cashInValidation = z.object({
  senderId: z.string().min(1, 'Sender ID is required'),
  reciverId: z.string().min(1, 'Receiver ID is required'),
  amount: z.number(),
  pin: z.string(),
  ref: z.string().optional(), // Reference is optional
  payType: z.enum(['Cash In'])
})

export const transactionValidations = {
  sendMoneyValidation,
  cashOutValidation,
  cashInValidation
}
