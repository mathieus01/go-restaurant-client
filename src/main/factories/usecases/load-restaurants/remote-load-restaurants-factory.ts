import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators'
import { RemoteLoadRestaurants } from '@/data/usecases'
import { LoadRestaurants } from '@/domain/usecases'

export const makeRemoteLoadRestaurants = (): LoadRestaurants => {
  return new RemoteLoadRestaurants('/restaurants', makeAuthorizeHttpClientDecorator())
}
