import React from 'react'
import AccountDetail from './account-detail'
import { Helper, ValidationStub } from '@/presentation/test'
import { ApiContext } from '@/presentation/contexts'
import { LoadFoodsByRestaurantSpy, SaveFoodSpy } from '@/domain/test'
import { AccessDeniedError, InvalidCredentialsError, UnexpectedError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'
import { Router } from 'react-router'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'
import MockDate from 'mockdate'
import faker from 'faker'

type SutParams = {
  loadFoodsByRestaurantSpy?: LoadFoodsByRestaurantSpy
  validationError?: string
}

type SutTypes = {
  loadFoodsByRestaurantSpy: LoadFoodsByRestaurantSpy
  saveFoodSpy: SaveFoodSpy
  setCurrentAccountMock: (account: AccountModel) => void
  history: MemoryHistory
  validationStub: ValidationStub
}

const makeSut = (params?: SutParams): SutTypes => {
  const saveFoodSpy = new SaveFoodSpy()
  const loadFoodsByRestaurantSpy = params?.loadFoodsByRestaurantSpy || new LoadFoodsByRestaurantSpy()
  const validationStub = new ValidationStub()
  validationStub.errorMessage = params?.validationError
  const history = createMemoryHistory({ initialEntries: ['/foods'], initialIndex: 1 })
  const setCurrentAccountMock = jest.fn()
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router history={history}>
        <AccountDetail loadFoodsByRestaurant={loadFoodsByRestaurantSpy} saveFood={saveFoodSpy} saveFoodValidation={validationStub} />
      </Router>
    </ApiContext.Provider>
  )
  return { loadFoodsByRestaurantSpy, setCurrentAccountMock, history, validationStub, saveFoodSpy }
}

const simulateValidSubmit = async (
  name = faker.name.findName(),
  type = faker.random.word(),
  price = faker.random.number(100),
  description = faker.random.words(5)): Promise<void> => {
  Helper.populateField('name', name)
  Helper.populateField('type', type)
  Helper.populateField('price', `${price}`)
  Helper.populateField('description', description)
  const form = screen.getByTestId('food-form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

describe('AccountDetail Component', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should present correct initial state', () => {
    makeSut()
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.queryByTestId('restaurant-container')).not.toBeInTheDocument()
    expect(screen.queryByTestId('save-food-container')).not.toBeInTheDocument()
  })
  test('Should call loadFoodsByRestaurant on start', async () => {
    const { loadFoodsByRestaurantSpy } = makeSut()
    expect(loadFoodsByRestaurantSpy.callsCount).toBe(1)
    await waitFor(() => screen.getByTestId('header'))
  })
  test('Should render foods on success', async () => {
    makeSut()
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('foods-list').children).toHaveLength(1)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })
  test('Should render error on UnexpectedError', async () => {
    const loadFoodsByRestaurantSpy = new LoadFoodsByRestaurantSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadFoodsByRestaurantSpy, 'loadByRestaurants').mockRejectedValueOnce(error)
    makeSut({ loadFoodsByRestaurantSpy })
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
  })
  test('Should logout on AccessDeniedError', async () => {
    const loadFoodsByRestaurantSpy = new LoadFoodsByRestaurantSpy()
    jest.spyOn(loadFoodsByRestaurantSpy, 'loadByRestaurants').mockRejectedValueOnce(new AccessDeniedError())
    const { setCurrentAccountMock, history } = makeSut({ loadFoodsByRestaurantSpy })
    await waitFor(() => screen.getByTestId('header'))
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })
  test('Should call loadFoodsByRestaurant on reload', async () => {
    const loadFoodsByRestaurantSpy = new LoadFoodsByRestaurantSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadFoodsByRestaurantSpy, 'loadByRestaurants').mockRejectedValueOnce(error)
    makeSut({ loadFoodsByRestaurantSpy })
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
    fireEvent.click(screen.getByTestId('reload'))
    expect(loadFoodsByRestaurantSpy.callsCount).toBe(2)
    await waitFor(() => screen.getByTestId('header'))
  })
  test('Should render save-food-container correctly', async () => {
    makeSut()
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.queryByTestId('save-food-container')).not.toBeInTheDocument()
    fireEvent.click(screen.getByTestId('show-save-food'))
    expect(screen.getByTestId('save-food-container')).toBeInTheDocument()
  })
  test('Should show name error if Validation fails', async () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('show-save-food'))
    Helper.populateField('name')
    Helper.testStatusForField('name', validationError)
  })
  test('Should show type error if Validation fails', async () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('show-save-food'))
    Helper.populateField('type')
    Helper.testStatusForField('type', validationError)
  })
  test('Should show description error if Validation fails', async () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('show-save-food'))
    Helper.populateField('description')
    Helper.testStatusForField('description', validationError)
  })
  test('Should show price error if Validation fails', async () => {
    const validationError = faker.random.words()
    makeSut({ validationError })
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('show-save-food'))
    Helper.populateField('price')
    Helper.testStatusForField('price', validationError)
  })
  test('Should enable submit button if form is valid', async () => {
    makeSut()
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('show-save-food'))
    Helper.populateField('name')
    Helper.populateField('type')
    Helper.populateField('description')
    Helper.populateField('price')
    expect(screen.getByTestId('submit')).toBeEnabled()
  })
  test('Should call SaveFood with correct values', async () => {
    const { saveFoodSpy } = makeSut()
    const name = faker.name.findName()
    const type = faker.random.word()
    const price = faker.random.number(100)
    const description = faker.random.words(5)
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('show-save-food'))
    await simulateValidSubmit(name, type, price, description)
    expect(saveFoodSpy.params).toEqual({
      name, type, price: `${price}`, description
    })
  })
  test('Should not call SaveFood if form is invalid', async () => {
    const validationError = faker.random.words()
    const { saveFoodSpy } = makeSut({ validationError })
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('show-save-food'))
    await simulateValidSubmit()
    expect(saveFoodSpy.callsCount).toBe(0)
  })
  test('Should present error if SaveFood fails', async () => {
    const { saveFoodSpy } = makeSut()
    const error = new UnexpectedError()
    jest.spyOn(saveFoodSpy, 'save').mockRejectedValueOnce(error)
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('show-save-food'))
    await simulateValidSubmit()
    expect(screen.getByTestId('main-error')).toHaveTextContent(error.message)
    expect(screen.getByTestId('error-wrap').children).toHaveLength(1)
  })
  test('Should call loadFoodsByRestaurant if SaveFood succeds', async () => {
    const { loadFoodsByRestaurantSpy } = makeSut()
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('show-save-food'))
    await simulateValidSubmit()
    expect(loadFoodsByRestaurantSpy.callsCount).toEqual(4)
  })
})
