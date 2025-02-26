import { Model } from 'mongoose'
import { TRole } from '../../types'

export type TUser = {
  _id?: string
  name: string
  pin: string
  mobileNo: string
  email: string
  accountType: TRole
  nid: string
  balance: number
  isDeleted: boolean
  isActive: boolean
}
export interface UserInterfaceModel extends Model<TUser> {
  isUserExist(email: string): Promise<TUser>
}
