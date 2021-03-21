import { AddOrder, LoadOrderById } from '@/domain/usecases'
import { OrderModel } from '@/domain/models/order-model'
import faker from 'faker'
import { FoodOrderModel } from '../models/food-order'
import { mockFoodModel } from './mock-foods'

export const mockAddOrderParams = (): AddOrder.Model => ({
  address: faker.random.words(3),
  foodsOrder: [{
    id: faker.random.number(),
    amount: 1,
    observation: faker.random.words(4)
  }]
})

export const mockFoodsOrdersModel = (): FoodOrderModel => ({
  id: faker.random.number(5),
  amount: faker.random.number(5),
  observation: faker.random.words(3),
  food: mockFoodModel(),
  order: mockOrderModel()
})
export const mockFoodsOrdersWithoutOrderModel = (): FoodOrderModel => ({
  id: faker.random.number(5),
  amount: faker.random.number(5),
  observation: faker.random.words(3),
  food: mockFoodModel()
})

export const mockOrderModel = (): OrderModel => ({
  address: faker.random.words(5),
  date: new Date('2021-02-16T00:00:00'),
  id: faker.random.number(5),
  status: faker.random.word(),
  foodsOrder: [mockFoodsOrdersWithoutOrderModel()]
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

export class LoadOrderByIdSpy implements LoadOrderById {
  callsCount = 0
  order = mockOrderModel()

  async loadById (): Promise<OrderModel> {
    this.callsCount++
    return Promise.resolve(this.order)
  }
}
