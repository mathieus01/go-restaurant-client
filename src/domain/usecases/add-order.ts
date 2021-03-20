export interface AddOrder {
  add(params: AddOrder.Model): Promise<AddOrder.Model>
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
