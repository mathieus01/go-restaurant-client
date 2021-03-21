import { makeAuthorizeHttpClientDecorator } from '@/main/factories/decorators'
import { makeApiUrl } from '@/main/factories/http'
import { LoadOrderById } from '@/domain/usecases'
import { RemoteLoadOrderById } from '@/data/usecases'

export const makeRemoteLoadOrderById = (id: string): LoadOrderById => {
  return new RemoteLoadOrderById(makeApiUrl(`/orders/${id}`), makeAuthorizeHttpClientDecorator())
}
