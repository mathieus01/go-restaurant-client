import { AddAccount } from '@/domain/usecases'
import faker from 'faker'
import { Authentication } from '../usecases/authentication'

export const mockAccountModel = (): AddAccount.Model => ({
  accessToken: faker.random.uuid(),
  name: faker.name.findName(),
  isRestaurant: false
})
export const mockAccountRestaurantModel = (): Authentication.Model => ({
  accessToken: faker.random.uuid(),
  name: faker.name.findName(),
  isRestaurant: true
})

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
