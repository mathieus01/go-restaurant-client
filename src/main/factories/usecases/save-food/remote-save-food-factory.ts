import { RemoteSaveFood } from '@/data/usecases'
import { SaveFood } from '@/domain/usecases'
import { makeAuthorizeHttpClientDecorator } from '../../decorators'
import { makeApiUrl } from '../../http'

export const makeRemoteSaveFood = (): SaveFood => {
  return new RemoteSaveFood(makeApiUrl('/foods'), makeAuthorizeHttpClientDecorator())
}
