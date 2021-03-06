import { AccountModel } from '@/domain/models'
import { makeLocalStorageAdapter } from '../factories/cache'

export const setCurrentAccountAdapter = (account: AccountModel): void => {
  makeLocalStorageAdapter().set('account', account)
}
