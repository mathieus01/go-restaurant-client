import { RestaurantModel } from '@/domain/models'

export interface LoadRestaurants {
  loadAll(): Promise<RestaurantModel>
}
