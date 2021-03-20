import React from 'react'
import FoodList from './food-list'
import { ApiContext } from '@/presentation/contexts'
import { AddOrderSpy, LoadFoodsByRestaurantSpy, mockAccountModel, mockFoodModelList } from '@/domain/test'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'
import { createMemoryHistory, MemoryHistory } from 'history'
import { fireEvent, render, screen, waitFor, act } from '@testing-library/react'
import { Router } from 'react-router-dom'
import MockDate from 'mockdate'

type SutTypes = {
  loadFoodsByRestaurantSpy: LoadFoodsByRestaurantSpy
  addOrderSpy: AddOrderSpy
  history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
}

const makeSut = (loadFoodsByRestaurantSpy = new LoadFoodsByRestaurantSpy()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/', '/restaurants/any_id'], initialIndex: 1 })
  const setCurrentAccountMock = jest.fn()
  const addOrderSpy = new AddOrderSpy()
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock, getCurrentAccount: () => mockAccountModel(), addOrder: addOrderSpy }}>
      <Router history={history}>
        <FoodList loadFoodsByRestaurant={loadFoodsByRestaurantSpy} />
      </Router>
    </ApiContext.Provider>
  )
  return { loadFoodsByRestaurantSpy, history, setCurrentAccountMock, addOrderSpy }
}

describe('FoodList Component', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should present correct initial state', async () => {
    makeSut()
    const foodList = screen.getByTestId('food-list')
    expect(foodList.childElementCount).toBe(0)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    await waitFor(() => foodList)
  })
  test('Should call LoadFoodsByRestaurant', async () => {
    const { loadFoodsByRestaurantSpy } = makeSut()
    expect(loadFoodsByRestaurantSpy.callsCount).toBe(1)
    await waitFor(() => screen.getByTestId('header'))
  })
  test('Should render FoodItem on success', async () => {
    makeSut()
    const foodList = screen.getByTestId('food-list')
    await waitFor(() => foodList)
    expect(foodList.querySelectorAll('li.foodItemWrap')).toHaveLength(1)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
  })
  test('Should render error on UnexpectedError', async () => {
    const loadFoodsByRestaurantSpy = new LoadFoodsByRestaurantSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadFoodsByRestaurantSpy, 'loadByRestaurants').mockRejectedValueOnce(error)
    makeSut(loadFoodsByRestaurantSpy)
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.queryByTestId('food-list')).not.toBeInTheDocument()
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
  test('Should call LoadSurveyList on reload', async () => {
    const loadFoodsByRestaurantSpy = new LoadFoodsByRestaurantSpy()
    jest.spyOn(loadFoodsByRestaurantSpy, 'loadByRestaurants').mockRejectedValueOnce(new UnexpectedError())
    makeSut(loadFoodsByRestaurantSpy)
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('reload'))
    expect(loadFoodsByRestaurantSpy.callsCount).toBe(1)
    await waitFor(() => screen.getByTestId('header'))
  })
  test('Should present correct cart initial state', () => {
    makeSut()
    expect(screen.queryByTestId('cartTitle')).not.toBeInTheDocument()
    expect(screen.queryByTestId('cartEmpty')).toBeInTheDocument()
  })
  test('Should present add food in cart', async () => {
    makeSut()
    expect(screen.queryByTestId('cartTitle')).not.toBeInTheDocument()
    expect(screen.queryByTestId('cartEmpty')).toBeInTheDocument()
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('food-item'))
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.queryByTestId('cartTitle')).toBeInTheDocument()
    expect(screen.queryByTestId('cartEmpty')).not.toBeInTheDocument()
  })
  test('Should remove food from cart', async () => {
    makeSut()
    expect(screen.queryByTestId('cartTitle')).not.toBeInTheDocument()
    expect(screen.queryByTestId('cartEmpty')).toBeInTheDocument()
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('food-item'))
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.queryByTestId('cartTitle')).toBeInTheDocument()
    expect(screen.queryByTestId('cartEmpty')).not.toBeInTheDocument()
    fireEvent.click(screen.getByTestId('removeButton'))
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.queryByTestId('cartTitle')).not.toBeInTheDocument()
    expect(screen.queryByTestId('cartEmpty')).toBeInTheDocument()
  })
  test('Should increase food amount from cart', async () => {
    const loadFoodsByRestaurantSpy = new LoadFoodsByRestaurantSpy()
    const foods = loadFoodsByRestaurantSpy.foodsResult
    makeSut(loadFoodsByRestaurantSpy)
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('food-item'))
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('increaseButton'))
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('food-name')).toHaveTextContent(`2x ${foods[0].name}`)
  })
  test('Should decrease food amount from cart', async () => {
    const loadFoodsByRestaurantSpy = new LoadFoodsByRestaurantSpy()
    const foods = loadFoodsByRestaurantSpy.foodsResult
    makeSut(loadFoodsByRestaurantSpy)
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('food-item'))
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('increaseButton'))
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('food-name')).toHaveTextContent(`2x ${foods[0].name}`)
    fireEvent.click(screen.getByTestId('decreaseButton'))
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('food-name')).toHaveTextContent(`1x ${foods[0].name}`)
    fireEvent.click(screen.getByTestId('decreaseButton'))
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.queryByTestId('cartTitle')).not.toBeInTheDocument()
    expect(screen.queryByTestId('cartEmpty')).toBeInTheDocument()
  })
  test('Should show the right subtotal, total and fee', async () => {
    const foods = mockFoodModelList()
    const loadFoodsByRestaurantSpy = new LoadFoodsByRestaurantSpy()
    loadFoodsByRestaurantSpy.foodsResult = foods
    makeSut(loadFoodsByRestaurantSpy)
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('food-item'))
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('subtotal')).toHaveTextContent(`R$ ${foods[0].price}`)
    expect(screen.getByTestId('total')).toHaveTextContent(`R$ ${foods[0].price + 6.99}`)
    fireEvent.click(screen.getByTestId('increaseButton'))
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('subtotal')).toHaveTextContent(`R$ ${foods[0].price * 2}`)
    expect(screen.getByTestId('total')).toHaveTextContent(`R$ ${(foods[0].price * 2) + 6.99}`)
    fireEvent.click(screen.getByTestId('decreaseButton'))
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('subtotal')).toHaveTextContent(`R$ ${foods[0].price}`)
    expect(screen.getByTestId('total')).toHaveTextContent(`R$ ${foods[0].price + 6.99}`)
  })
  test('Should call addOrder ', async () => {
    const foods = mockFoodModelList()
    const loadFoodsByRestaurantSpy = new LoadFoodsByRestaurantSpy()
    loadFoodsByRestaurantSpy.foodsResult = foods
    const { addOrderSpy } = makeSut(loadFoodsByRestaurantSpy)
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('food-item'))
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('checkout'))
    await waitFor(() => screen.getByTestId('header'))
    expect(addOrderSpy.params).toEqual({
      date: new Date(),
      address: 'any_address',
      status: 'CRIADA',
      foodsOrder: [{
        food_id: foods[0].id,
        amount: 1,
        observation: 'any_observation'
      }]
    })
  })
})
