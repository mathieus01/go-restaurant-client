import { FoodModel } from './food-model'
import { OrderModel } from './order-model'

export interface FoodOrderModel {
  id: number
  food: FoodModel
  order: OrderModel
  amount: number
  observation: string
}
