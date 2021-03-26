import React from 'react'
import AccountDetail from './account-detail'
import { ApiContext } from '@/presentation/contexts'
import { LoadFoodsByRestaurantSpy } from '@/domain/test'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'
import { Router } from 'react-router'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'
import MockDate from 'mockdate'

type SutTypes = {
  loadFoodsByRestaurantSpy: LoadFoodsByRestaurantSpy
  setCurrentAccountMock: (account: AccountModel) => void
  history: MemoryHistory
}

const makeSut = (loadFoodsByRestaurantSpy = new LoadFoodsByRestaurantSpy()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/foods'], initialIndex: 1 })
  const setCurrentAccountMock = jest.fn()
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router history={history}>
        <AccountDetail loadFoodsByRestaurant={loadFoodsByRestaurantSpy} />
      </Router>
    </ApiContext.Provider>
  )
  return { loadFoodsByRestaurantSpy, setCurrentAccountMock, history }
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
    makeSut(loadFoodsByRestaurantSpy)
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
  })
  test('Should logout on AccessDeniedError', async () => {
    const loadFoodsByRestaurantSpy = new LoadFoodsByRestaurantSpy()
    jest.spyOn(loadFoodsByRestaurantSpy, 'loadByRestaurants').mockRejectedValueOnce(new AccessDeniedError())
    const { setCurrentAccountMock, history } = makeSut(loadFoodsByRestaurantSpy)
    await waitFor(() => screen.getByTestId('header'))
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })
  test('Should call loadFoodsByRestaurant on reload', async () => {
    const loadFoodsByRestaurantSpy = new LoadFoodsByRestaurantSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadFoodsByRestaurantSpy, 'loadByRestaurants').mockRejectedValueOnce(error)
    makeSut(loadFoodsByRestaurantSpy)
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
    fireEvent.click(screen.getByTestId('reload'))
    expect(loadFoodsByRestaurantSpy.callsCount).toBe(2)
    await waitFor(() => screen.getByTestId('header'))
  })
  test('Should render food correctly', async () => {
    const loadFoodsByRestaurantSpy = new LoadFoodsByRestaurantSpy()
    const food = loadFoodsByRestaurantSpy.foodsResult[0]
    makeSut(loadFoodsByRestaurantSpy)
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('food-name')).toHaveTextContent(food.name)
    expect(screen.getByTestId('food-description')).toHaveTextContent(food.description)
    expect(screen.getByTestId('food-price')).toHaveTextContent(`${food.price}`)
  })
})
