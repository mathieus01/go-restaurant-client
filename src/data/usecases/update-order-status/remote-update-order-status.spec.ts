import { HttpClientSpy } from '@/data/test'
import { RemoteUpdateOrderStatus } from './remote-update-order-status'
import faker from 'faker'
import { mockUpdateOrderStatusParams } from '@/domain/test'
import { HttpStatusCode } from '@/data/protocols/http'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'

type SutTypes = {
  sut: RemoteUpdateOrderStatus
  httpClientSpy: HttpClientSpy
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy()
  const sut = new RemoteUpdateOrderStatus(url, httpClientSpy)
  return { sut, httpClientSpy }
}

describe('RemoteUpdateOrderStatus', () => {
  test('Should call HttpClient with correct values', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    const { orderId, status } = mockUpdateOrderStatusParams()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    }
    await sut.updateOrderStatus({ orderId, status })
    expect(httpClientSpy.body).toEqual({ status })
    expect(httpClientSpy.url).toBe(`${url}/${orderId}/status`)
    expect(httpClientSpy.method).toBe('put')
  })
  test('Should throw UnexpectedError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut()
    const updateOrderStatusParams = mockUpdateOrderStatusParams()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.updateOrderStatus(updateOrderStatusParams)
    await expect(promise).rejects.toEqual(new UnexpectedError())
  })
  test('Should throw UnexpectedError if HttpClient returns 400', async () => {
    const { sut, httpClientSpy } = makeSut()
    const updateOrderStatusParams = mockUpdateOrderStatusParams()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const promise = sut.updateOrderStatus(updateOrderStatusParams)
    await expect(promise).rejects.toEqual(new UnexpectedError())
  })
  test('Should throw UnexpectedError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut()
    const updateOrderStatusParams = mockUpdateOrderStatusParams()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = sut.updateOrderStatus(updateOrderStatusParams)
    await expect(promise).rejects.toEqual(new UnexpectedError())
  })
  test('Should throw AccessDeniedError if HttpClient returns 401', async () => {
    const { sut, httpClientSpy } = makeSut()
    const updateOrderStatusParams = mockUpdateOrderStatusParams()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    }
    const promise = sut.updateOrderStatus(updateOrderStatusParams)
    await expect(promise).rejects.toEqual(new AccessDeniedError())
  })
  test('Should return nothing on 201', async () => {
    const { sut, httpClientSpy } = makeSut()
    const updateOrderStatusParams = mockUpdateOrderStatusParams()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.noContent
    }
    const promise = sut.updateOrderStatus(updateOrderStatusParams)
    await expect(promise).resolves.toBeFalsy()
  })
})
