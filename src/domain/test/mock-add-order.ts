import { AddOrder } from '../usecases'
import faker from 'faker'
import { OrderModel } from '../models/order-model'

export const mockAddOrderParams = (): AddOrder.Model => ({
  address: faker.random.words(3),
  foodsOrder: [{
    id: faker.random.number(),
    amount: 1,
    observation: faker.random.words(4)
  }]
})

export const mockOrderModel = (): OrderModel => ({
  address: faker.random.words(5),
  date: new Date('2021-02-16T00:00:00'),
  id: faker.random.number(5),
  status: faker.random.word()
})

export class AddOrderSpy implements AddOrder {
  callsCount = 0
  params = null
  order = mockOrderModel()

  async add (params: AddOrder.Model): Promise<OrderModel> {
    this.callsCount++
    this.params = params
    return Promise.resolve(this.order)
  }
}
