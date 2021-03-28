import { RemoteUpdateOrderStatus } from '@/data/usecases'
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators'
import { makeApiUrl } from '@/main/factories/http'

export const makeRemoteUpdateOrderStatus = (): RemoteUpdateOrderStatus => {
  return new RemoteUpdateOrderStatus(makeApiUrl('/orders'), makeAuthorizeHttpClientDecorator())
}
