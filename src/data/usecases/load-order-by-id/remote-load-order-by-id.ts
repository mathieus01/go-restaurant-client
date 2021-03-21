import { HttpClient, HttpStatusCode } from '@/data/protocols/http'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { LoadOrderById } from '@/domain/usecases'

export class RemoteLoadOrderById implements LoadOrderById {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient<RemoteLoadOrderById.Model>
  ) {}

  async loadById (): Promise<LoadOrderById.Model> {
    const httpResponse = await this.httpClient.request({
      url: this.url,
      method: 'get'
    })
    switch (httpResponse.statusCode) {
      case HttpStatusCode.forbidden: throw new AccessDeniedError()
      case HttpStatusCode.ok: return httpResponse.body
      default: throw new UnexpectedError()
    }
  }
}

export namespace RemoteLoadOrderById {
  export type Model = LoadOrderById.Model
}
