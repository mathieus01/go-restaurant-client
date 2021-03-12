import { HttpClient, HttpStatusCode } from '@/data/protocols/http'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { AddOrder } from '@/domain/usecases'

export class RemoteAddOrder implements AddOrder {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient<AddOrder.Model>
  ) {}

  async add (params: AddOrder.Model): Promise<AddOrder.Model> {
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
