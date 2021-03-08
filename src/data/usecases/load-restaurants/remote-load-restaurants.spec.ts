import { HttpStatusCode } from '@/data/protocols/http'
import { HttpClientSpy, mockRemoteRestaurantListModel } from '@/data/test'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { LoadRestaurants } from '@/domain/usecases'
import faker from 'faker'
import { RemoteLoadRestaurants } from './remote-load-restaurants'

type SutTypes = {
  sut: RemoteLoadRestaurants
  httpClientSpy: HttpClientSpy<LoadRestaurants.Model[]>
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<LoadRestaurants.Model[]>()
  const sut = new RemoteLoadRestaurants(url, httpClientSpy)
  return { sut, httpClientSpy }
}

describe('RemoteLoadRestaurants', () => {
  test('Should call httpClient with correct URL and Method', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    await sut.loadAll()
    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('get')
  })
  test('Should throw AccessDeniedError if HttpClient returns 403', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    }
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow(new AccessDeniedError())
  })
  test('Should throw UnexpectedError if HttpClient returns 404', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('Should throw UnexpectedError if HttpClient returns 500', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.loadAll()
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('Should return a list of RestaurantModels of HttpClient returns 200', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    const httpResult = mockRemoteRestaurantListModel()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const httpResponse = await sut.loadAll()
    expect(httpResponse).toEqual(httpResult)
  })
  test('Should return a list of RestaurantModels of HttpClient returns 200', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    }
    const httpResponse = await sut.loadAll()
    expect(httpResponse).toEqual([])
  })
})
