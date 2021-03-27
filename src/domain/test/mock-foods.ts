import faker from 'faker'
import { LoadFoodsByRestaurant, SaveFood } from '@/domain/usecases'
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

export const mockSaveFoodParams = (): SaveFood.Params => ({
  name: faker.name.findName(),
  description: faker.random.words(6),
  price: faker.random.number(),
  type: faker.random.words(2)
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

export class SaveFoodSpy implements SaveFood {
  callsCount = 0
  foodResult = mockFoodModel()
  params = null

  async save (params: SaveFood.Params): Promise<FoodModel> {
    this.callsCount++
    this.params = params
    return Promise.resolve(this.foodResult)
  }
}
