import { RemoteLoadOrders } from './remote-load-orders'
import { HttpStatusCode } from '@/data/protocols/http'
import { HttpClientSpy } from '@/data/test'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { mockOrderModel } from '@/domain/test'
import faker from 'faker'

type SutTypes = {
  sut: RemoteLoadOrders
  httpClientSpy: HttpClientSpy
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy()
  const sut = new RemoteLoadOrders(url, httpClientSpy)
  return { sut, httpClientSpy }
}

describe('RemoteLoadOrders', () => {
  test('Should call httpClient with correct values', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: [mockOrderModel()]
    }
    await sut.load()
    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('get')
  })
  test('Should throw AccessDeniedError if HttpClient returns 403', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = sut.load()
    await expect(promise).rejects.toEqual(new AccessDeniedError())
  })
  test('Should throw UnexpectedError if HttpClient returns 404', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = sut.load()
    await expect(promise).rejects.toEqual(new UnexpectedError())
  })
  test('Should throw UnexpectedError if HttpClient returns 500', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.load()
    await expect(promise).rejects.toEqual(new UnexpectedError())
  })
  test('Should return orders on 200', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    const httpResult = [mockOrderModel()]
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const foods = await sut.load()
    expect(foods).toEqual(httpResult)
  })
})
