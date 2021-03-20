import { createContext } from 'react'
import { AccountModel } from '@/domain/models'
import { AddOrder } from '@/domain/usecases'

type Props = {
  setCurrentAccount?: (account: AccountModel) => void
  getCurrentAccount?: () => AccountModel
  addOrder?: AddOrder
}

export default createContext<Props>(null)
