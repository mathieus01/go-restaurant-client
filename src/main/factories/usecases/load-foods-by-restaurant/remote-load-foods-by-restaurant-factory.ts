import { RemoteLoadFoodsByRestaurant } from '@/data/usecases'
import { LoadFoodsByRestaurant } from '@/domain/usecases'
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators'
import { makeApiUrl } from '@/main/factories/http'

export const makeRemoteLoadFoodsByRestaurant = (id: string): LoadFoodsByRestaurant => {
  return new RemoteLoadFoodsByRestaurant(makeApiUrl(`/restaurants/${id}/menu`), makeAuthorizeHttpClientDecorator())
}
