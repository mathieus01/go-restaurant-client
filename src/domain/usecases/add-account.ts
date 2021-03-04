import { AccountModel } from '@/domain/models'

export interface AddAccount {
  add(params: AddAccount.Params): Promise<AddAccount.Model>
}

export namespace AddAccount {
  export type Params = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
    isRestaurant: boolean
  }

  export type Model = AccountModel
}
