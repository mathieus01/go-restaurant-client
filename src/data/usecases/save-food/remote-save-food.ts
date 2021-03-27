import { HttpClient, HttpStatusCode } from '@/data/protocols/http'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { SaveFood } from '@/domain/usecases'

export class RemoteSaveFood implements SaveFood {
  constructor (
    private readonly url: string,
    private readonly httpClient: HttpClient<SaveFood.Model>
  ) {}

  async save (params: SaveFood.Params): Promise<RemoteSaveFood.Model> {
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

export namespace RemoteSaveFood {
  export type Model = SaveFood.Model
}
