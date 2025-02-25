import { z } from 'zod'

export const sendMoneyValidation = z.object({
  senderId: z.string().min(1, 'Sender ID is required'),
  reciverId: z.string().min(1, 'Receiver ID is required'),
  amount: z.number(),
  ref: z.string().optional(), // Reference is optional
  payType: z.enum(['Send Money'])
})

export const transactionValidations = { sendMoneyValidation }
