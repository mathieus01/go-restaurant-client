import { FoodModel } from '@/domain/models'

export interface LoadFoodsByRestaurant {
  loadByRestaurants(): Promise<LoadFoodsByRestaurant.Model[]>
}

export namespace LoadFoodsByRestaurant {
  export type Model = FoodModel
}
