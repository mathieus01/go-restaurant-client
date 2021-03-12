export interface AddOrder {
  add(params: AddOrder.Model): Promise<AddOrder.Model>
}

export namespace AddOrder {
  export type Model = {
    foodsOrder: FoodOrder[]
    address: string
    account_id: number
  }
  export type FoodOrder = {
    id: number
    amount: number
    observation: string
  }
}
