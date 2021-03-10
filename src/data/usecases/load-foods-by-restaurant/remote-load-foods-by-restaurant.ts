import { HttpClient, HttpStatusCode } from '@/data/protocols/http'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { LoadFoodsByRestaurant } from '@/domain/usecases'

export class RemoteLoadFoodsByRestaurant implements LoadFoodsByRestaurant {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteLoadFoodsByRestaurant.Model[]>
  ) {}

  async loadByRestaurants (): Promise<LoadFoodsByRestaurant.Model[]> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'get'
    })
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body
      case HttpStatusCode.forbidden: throw new AccessDeniedError()
      default: throw new UnexpectedError()
    }
  }
}

export namespace RemoteLoadFoodsByRestaurant {
  export type Model = LoadFoodsByRestaurant.Model
}
