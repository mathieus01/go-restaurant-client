import { HttpClientSpy } from '@/data/test'
import { RemoteLoadOrderById } from './remote-load-order-by-id'
import faker from 'faker'
import { HttpStatusCode } from '@/data/protocols/http'
import { mockOrderModel } from '@/domain/test'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'

type SutTypes = {
  sut: RemoteLoadOrderById
  httpClientSpy: HttpClientSpy
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy()
  const sut = new RemoteLoadOrderById(url, httpClientSpy)
  return { sut, httpClientSpy }
}

describe('RemoteLoadOrderById', () => {
  test('Should call httpClient with correct values', async () => {
    const url = faker.internet.url()
    const { httpClientSpy, sut } = makeSut(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockOrderModel()
    }
    await sut.loadById(1)
    expect(httpClientSpy.url).toEqual(url)
    expect(httpClientSpy.method).toEqual('get')
  })
  test('Should throw AccessDeniedError if HttpClient returns 403', async () => {
    const { httpClientSpy, sut } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = sut.loadById(1)
    await expect(promise).rejects.toEqual(new AccessDeniedError())
  })
  test('Should throw UnexpectedError if HttpClient returns 404', async () => {
    const { httpClientSpy, sut } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = sut.loadById(1)
    await expect(promise).rejects.toEqual(new UnexpectedError())
  })
  test('Should throw UnexpectedError if HttpClient returns 500', async () => {
    const { httpClientSpy, sut } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.loadById(1)
    await expect(promise).rejects.toEqual(new UnexpectedError())
  })
  test('Should return OrderModel on 200', async () => {
    const { httpClientSpy, sut } = makeSut()
    const order = mockOrderModel()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: order
    }
    const orderModel = await sut.loadById(1)
    await expect(orderModel).toEqual(order)
  })
})
