import { RemoteAuthentication } from './remote-authentication'
import { HttpStatusCode } from '@/data/protocols/http'
import { HttpClientSpy } from '@/data/test'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors'
import { mockAccountModel, mockAuthenticationParams } from '@/domain/test'
import { Authentication } from '@/domain/usecases'
import faker from 'faker'

type SutTypes = {
  sut: RemoteAuthentication
  httpClientSpy: HttpClientSpy<Authentication.Model>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpClientSpy = new HttpClientSpy<Authentication.Model>()
  const sut = new RemoteAuthentication(url, httpClientSpy)
  return {
    sut,
    httpClientSpy
  }
}

describe('RemoteAuthentication', () => {
  test('Should call HttpClient with correct URL and method', async () => {
    const url = faker.internet.url()
    const { sut, httpClientSpy } = makeSut(url)
    const authenticationParams = mockAuthenticationParams()
    await sut.auth(authenticationParams)
    expect(httpClientSpy.body).toEqual(authenticationParams)
    expect(httpClientSpy.url).toBe(url)
    expect(httpClientSpy.method).toBe('post')
  })
  test('Should throw InvalidCredentialsError if HttpClient returns 401 ', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    }
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })
  test('Should throw InvalidCredentialsError if HttpClient returns 400 ', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('Should throw InvalidCredentialsError if HttpClient returns 500', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('Should throw InvalidCredentialsError if HttpClient returns 404', async () => {
    const { sut, httpClientSpy } = makeSut()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = sut.auth(mockAuthenticationParams())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('Should return an Authentication.Model if HttpClient returns 200', async () => {
    const { sut, httpClientSpy } = makeSut()
    const httpResult = mockAccountModel()
    httpClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const accountModel = await sut.auth(mockAuthenticationParams())
    await expect(accountModel).toEqual(httpResult)
  })
})
