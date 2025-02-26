export type TTransaction = {
  senderId: string
  reciverId: string
  amount: number
  transactionFee?: number
  pin: string
  ref?: string
  payType: 'Send Money' | 'Cash Out' | 'Cash In'
}
