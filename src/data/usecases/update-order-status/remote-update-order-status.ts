import { HttpClient, HttpStatusCode } from '@/data/protocols/http'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { UpdateOrderStatus } from '@/domain/usecases'

export class RemoteUpdateOrderStatus implements UpdateOrderStatus {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient
  ) {}

  async updateOrderStatus (params: UpdateOrderStatus.Params): Promise<void> {
    const { orderId, status } = params
    const httpResponse = await this.httpClient.request({
      url: `${this.url}/${orderId}/status`,
      body: { status },
      method: 'put'
    })
    switch (httpResponse.statusCode) {
      case HttpStatusCode.unauthorized: throw new AccessDeniedError()
      case HttpStatusCode.noContent: return null
      default: throw new UnexpectedError()
    }
  }
}
