import { OrderModel } from '../models/order-model'

export interface LoadOrders {
  load(): Promise<LoadOrders.Model[]>
}

export namespace LoadOrders {
  export type Model = OrderModel
}
