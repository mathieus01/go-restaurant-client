import { RemoteAddOrder } from '@/data/usecases'
import { AddOrder } from '@/domain/usecases'
import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators'
import { makeApiUrl } from '@/main/factories/http'

export const makeRemoteAddOrder = (): AddOrder => {
  return new RemoteAddOrder(makeApiUrl('/orders'), makeAuthorizeHttpClientDecorator())
}
