import { RestaurantModel } from '@/domain/models'

export interface LoadRestaurants {
  loadAll(): Promise<LoadRestaurants.Model[]>
}

export namespace LoadRestaurants {
  export type Model = RestaurantModel
}
