import { RestaurantModel } from './restaurant-model'

export interface FoodModel {
  id?: number
  name: string
  image: string
  price: number
  type?: string
  description?: string
  restaurant?: RestaurantModel
}
