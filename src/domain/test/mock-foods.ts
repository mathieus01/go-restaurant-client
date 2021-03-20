import faker from 'faker'
import { LoadFoodsByRestaurant } from '@/domain/usecases'
import { FoodModel } from '../models'
import { mockRestaurantModel } from './mock-restaurant'

export const mockFoodModel = (): LoadFoodsByRestaurant.Model => ({
  id: faker.random.number(),
  name: faker.name.findName(),
  image: faker.internet.url(),
  price: faker.random.number(100),
  description: faker.random.words(6),
  type: faker.random.word(),
  restaurant: mockRestaurantModel()
})

export const mockFoodModelList = (): LoadFoodsByRestaurant.Model[] => [mockFoodModel()]

export class LoadFoodsByRestaurantSpy implements LoadFoodsByRestaurant {
  callsCount = 0
  foodsResult = mockFoodModelList()

  async loadByRestaurants (): Promise<FoodModel[]> {
    this.callsCount++
    return Promise.resolve(this.foodsResult)
  }
}
