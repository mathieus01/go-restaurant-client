import { HttpClient, HttpStatusCode } from '@/data/protocols/http'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { LoadRestaurants } from '@/domain/usecases'

export class RemoteLoadRestaurants implements LoadRestaurants {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteLoadRestaurants.Model[]>
  ) {}

  async loadAll (): Promise<LoadRestaurants.Model[]> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'get'
    })
    const remoteRestaurants = httpResponse.body || []
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return remoteRestaurants
      case HttpStatusCode.noContent: return []
      case HttpStatusCode.unauthorized: throw new AccessDeniedError()
      default: throw new UnexpectedError()
    }
  }
}

export namespace RemoteLoadRestaurants {
  export type Model = LoadRestaurants.Model
}
