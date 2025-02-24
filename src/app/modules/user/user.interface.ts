import { Model } from 'mongoose'
import { TRole } from '../../types'

export type TUser = {
  name: string
  pin: string
  mobileNo: string
  email: string
  accountType: TRole
  nid: string
  isDeleted: boolean
}
export interface UserInterfaceModel extends Model<TUser> {
  isUserExist(email: string): Promise<TUser>
}
