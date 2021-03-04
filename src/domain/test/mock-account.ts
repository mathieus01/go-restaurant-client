import { AddAccount } from '@/domain/usecases'
import faker from 'faker'

export const mockAccountModel = (): AddAccount.Model => ({
  accessToken: faker.random.uuid(),
  name: faker.name.findName()
})
