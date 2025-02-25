import { z } from 'zod'

const createUserValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  mobileNo: z.string().min(1, 'Mobile number is required'),
  pin: z
    .string()
    .length(6, 'PIN must be exactly 6 digits')
    .regex(/^[0-9]{6}$/, 'PIN must be a 6-digit number'),
  nid: z.string().min(1, 'NID is required'),
  accountType: z.enum(['admin', 'agent', 'user']),
  isDeleted: z.boolean().optional(),
  balance: z.number().optional()
})

export const userValidations = {
  createUserValidationSchema
}
