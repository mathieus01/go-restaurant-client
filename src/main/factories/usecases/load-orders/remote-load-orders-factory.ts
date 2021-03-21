import { RemoteLoadOrders } from '@/data/usecases'
import { LoadOrders } from '@/domain/usecases'
import { makeAuthorizeHttpClientDecorator } from '../../decorators'
import { makeApiUrl } from '../../http'

export const makeRemoteLoadOrders = (): LoadOrders => {
  return new RemoteLoadOrders(makeApiUrl('/orders'), makeAuthorizeHttpClientDecorator())
}
