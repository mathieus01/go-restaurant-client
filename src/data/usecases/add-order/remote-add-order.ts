import { HttpClient, HttpStatusCode } from '@/data/protocols/http'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { OrderModel } from '@/domain/models/order-model'
import { AddOrder } from '@/domain/usecases'

export class RemoteAddOrder implements AddOrder {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient<AddOrder.Model>
  ) {}

  async add (params: AddOrder.Model): Promise<OrderModel> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'post',
      body: params
    })
    const responseBody = httpResponse.body
    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return responseBody
      case HttpStatusCode.unauthorized: throw new AccessDeniedError()
      default: throw new UnexpectedError()
    }
  }
}
