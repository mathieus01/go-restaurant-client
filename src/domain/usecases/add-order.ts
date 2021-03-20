import { OrderModel } from '../models/order-model'

export interface AddOrder {
  add(params: AddOrder.Model): Promise<OrderModel>
}

export namespace AddOrder {
  export type Model = {
    foodsOrder: FoodOrder[]
    address: string
  }
  export type FoodOrder = {
    id: number
    amount: number
    observation: string
  }
}
