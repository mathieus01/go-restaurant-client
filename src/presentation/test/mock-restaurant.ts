import { mockRemoteRestaurantListModel } from '@/data/test'
import { LoadRestaurants } from '@/domain/usecases'

export class LoadRestaurantsSpy implements LoadRestaurants {
  callsCount = 0
  restaurants = mockRemoteRestaurantListModel()

  async loadAll (): Promise<LoadRestaurants.Model[]> {
    this.callsCount++
    return Promise.resolve(this.restaurants)
  }
}
