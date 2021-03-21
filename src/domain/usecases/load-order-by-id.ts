import { OrderModel } from '@/domain/models/order-model'

export interface LoadOrderById {
  loadById(): Promise<LoadOrderById.Model>
}

export namespace LoadOrderById {
  export type Model = OrderModel
}
