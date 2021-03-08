import { RestaurantModel } from '@/domain/models'

export interface LoadRestaurants {
  loadAll(): Promise<LoadRestaurants.Model>
}

export namespace LoadRestaurants {
  export type Model = {
    id: number
    name: string
    description: string
    address: string
  }
}
