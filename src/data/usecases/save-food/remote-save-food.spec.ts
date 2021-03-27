import { HttpStatusCode } from '@/data/protocols/http'
import { HttpClientSpy } from '@/data/test'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { mockFoodModel, mockSaveFoodParams } from '@/domain/test'
import faker from 'faker'
import { RemoteSaveFood } from './remote-save-food'

type SutTypes = {
  sut: RemoteSaveFood
  httpClientSpy: HttpClientSpy<RemoteSaveFood.Model>
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy()
  const sut = new RemoteSaveFood(url, httpClientSpy)
  return { sut, httpClientSpy }
}

describe('RemoteSaveFood', () => {
  test('Should call HttpClient with correct values', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    const saveFoodParams = mockSaveFoodParams()
    await sut.save(saveFoodParams)
    expect(httpClientSpy.body).toEqual(saveFoodParams)
    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('post')
  })
  test('Should throw UnexpectedError if HttpClient returns 400', async () => {
    const { sut, httpClientSpy } = makeSut()
    const saveFoodParams = mockSaveFoodParams()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const promise = sut.save(saveFoodParams)
    await expect(promise).rejects.toEqual(new UnexpectedError())
  })
  test('Should throw UnexpectedError if HttpClient returns 401', async () => {
    const { sut, httpClientSpy } = makeSut()
    const saveFoodParams = mockSaveFoodParams()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    }
    const promise = sut.save(saveFoodParams)
    await expect(promise).rejects.toEqual(new AccessDeniedError())
  })
  test('Should return an SaveFood.Model if HttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut()
    const saveFoodParams = mockSaveFoodParams()
    const foodModel = mockFoodModel()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: foodModel
    }
    const promise = await sut.save(saveFoodParams)
    expect(promise).toEqual(foodModel)
  })
})
