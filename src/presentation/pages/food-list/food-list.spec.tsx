import React from 'react'
import FoodList from './food-list'
import { ApiContext } from '@/presentation/contexts'
import { LoadFoodsByRestaurantSpy, mockAccountModel } from '@/domain/test'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'
import { createMemoryHistory, MemoryHistory } from 'history'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Router } from 'react-router-dom'

type SutTypes = {
  loadFoodsByRestaurantSpy: LoadFoodsByRestaurantSpy
  history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
}

const makeSut = (loadFoodsByRestaurantSpy = new LoadFoodsByRestaurantSpy()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/', '/restaurants/any_id'], initialIndex: 1 })
  const setCurrentAccountMock = jest.fn()
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock, getCurrentAccount: () => mockAccountModel() }}>
      <Router history={history}>
        <FoodList loadFoodsByRestaurant={loadFoodsByRestaurantSpy} />
      </Router>
    </ApiContext.Provider>
  )
  return { loadFoodsByRestaurantSpy, history, setCurrentAccountMock }
}

describe('FoodList Component', () => {
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
})
