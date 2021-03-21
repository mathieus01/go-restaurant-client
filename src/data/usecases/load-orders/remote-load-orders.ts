import { HttpClient, HttpStatusCode } from '@/data/protocols/http'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { OrderModel } from '@/domain/models/order-model'
import { LoadOrders } from '@/domain/usecases'

export class RemoteLoadOrders implements LoadOrders {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteLoadOrders.Model[]>
  ) {}

  async load (): Promise<OrderModel[]> {
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

export namespace RemoteLoadOrders {
  export type Model = LoadOrders.Model
}
