import { FoodModel } from '../models'

export interface SaveFood {
  save(params: SaveFood.Params): Promise<SaveFood.Model>
}

export namespace SaveFood {
  export type Params = {
    name: string
    description: string
    price: number
    type: string
  }
  export type Model = FoodModel
}
