import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators'
import { RemoteLoadRestaurants } from '@/data/usecases'
import { LoadRestaurants } from '@/domain/usecases'
import { makeApiUrl } from '../../http'

export const makeRemoteLoadRestaurants = (): LoadRestaurants => {
  return new RemoteLoadRestaurants(makeApiUrl('/restaurants'), makeAuthorizeHttpClientDecorator())
}
