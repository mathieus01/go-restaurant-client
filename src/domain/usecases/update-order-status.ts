export interface UpdateOrderStatus {
  updateOrderStatus(params: UpdateOrderStatus.Params): Promise<void>
}

export namespace UpdateOrderStatus {
  export type Params = {
    orderId: number
    status: number
  }
}
