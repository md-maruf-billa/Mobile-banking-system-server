import z from 'zod'

const loginValidation = z.object({
  email: z.string().email('Invalid email format').optional(),
  mobileNo: z.string().optional(),
  pin: z
    .string()
    .length(6, 'PIN must be exactly 6 digits')
    .regex(/^[0-9]{6}$/, 'PIN must be a 6-digit number')
})

export const authValidation = {
  loginValidation
}
