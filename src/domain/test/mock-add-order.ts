import { AddOrder } from '../usecases'
import faker from 'faker'

export const mockAddOrderParams = (): AddOrder.Model => ({
  account_id: faker.random.number(),
  address: faker.random.words(3),
  foodsOrder: [{
    id: faker.random.number(),
    amount: 1,
    observation: faker.random.words(4)
  }]
})
