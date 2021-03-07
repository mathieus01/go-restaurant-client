import { RemoteAuthentication } from '@/data/usecases/authentication/remote-authentication'
import { makeApiUrl, makeAxiosHttpClient } from '@/main/factories/http'

export const makeRemoteAuthentication = (): RemoteAuthentication => {
  return new RemoteAuthentication(makeApiUrl('/login'), makeAxiosHttpClient())
}
