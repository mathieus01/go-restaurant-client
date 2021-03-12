import { RemoteAddOrder } from './remote-add-order'
import { HttpClientSpy } from '@/data/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { mockAddOrderParams } from '@/domain/test'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import faker from 'faker'

type SutTypes = {
  sut: RemoteAddOrder
  httpClientSpy: HttpClientSpy
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy()
  const sut = new RemoteAddOrder(url, httpClientSpy)
  return { sut, httpClientSpy }
}

describe('RemoteAddOrder', () => {
  test('Should call httpClient with correct params', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    const addOrderParams = mockAddOrderParams()
    await sut.add(addOrderParams)
    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('post')
    expect(httpClientSpy.body).toEqual(addOrderParams)
  })
  test('Should throw UnexpectedError if HttpClient returns 400', async () => {
    const { sut, httpClientSpy } = makeSut()
    const addOrderParams = mockAddOrderParams()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const promise = sut.add(addOrderParams)
    await expect(promise).rejects.toEqual(new UnexpectedError())
  })
  test('Should throw UnexpectedError if HttpClient returns 401', async () => {
    const { sut, httpClientSpy } = makeSut()
    const addOrderParams = mockAddOrderParams()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    }
    const promise = sut.add(addOrderParams)
    await expect(promise).rejects.toEqual(new AccessDeniedError())
  })
  test('Should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut()
    const addOrderParams = mockAddOrderParams()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.add(addOrderParams)
    await expect(promise).rejects.toEqual(new UnexpectedError())
  })
  test('Should return an AddOrder.Model if HttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut()
    const addOrderParams = mockAddOrderParams()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: addOrderParams
    }
    const orderModel = await sut.add(addOrderParams)
    expect(orderModel).toEqual(addOrderParams)
  })
})
