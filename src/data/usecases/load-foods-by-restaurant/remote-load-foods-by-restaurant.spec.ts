import { RemoteLoadFoodsByRestaurant } from './remote-load-foods-by-restaurant'
import { HttpStatusCode } from '@/data/protocols/http'
import { HttpClientSpy, mockRemoteFoodModelList } from '@/data/test'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import faker from 'faker'

type SutTypes = {
  sut: RemoteLoadFoodsByRestaurant
  httpClientSpy: HttpClientSpy
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy()
  const sut = new RemoteLoadFoodsByRestaurant(url, httpClientSpy)
  return { sut, httpClientSpy }
}

describe('RemoteLoadFoodsByRestaurant', () => {
  test('Should call httpClient with correct values', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockRemoteFoodModelList()
    }
    await sut.loadByRestaurants()
    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('get')
  })
  test('Should throw AccessDeniedError if HttpClient returns 403', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = sut.loadByRestaurants()
    await expect(promise).rejects.toEqual(new AccessDeniedError())
  })
  test('Should throw UnexpectedError if HttpClient returns 404', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = sut.loadByRestaurants()
    await expect(promise).rejects.toEqual(new UnexpectedError())
  })
  test('Should throw UnexpectedError if HttpClient returns 500', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.loadByRestaurants()
    await expect(promise).rejects.toEqual(new UnexpectedError())
  })
  test('Should return FoodList on 200', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    const httpResult = mockRemoteFoodModelList()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const foods = await sut.loadByRestaurants()
    expect(foods).toEqual(httpResult)
  })
})
