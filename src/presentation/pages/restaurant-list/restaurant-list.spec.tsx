import React from 'react'
import { RestaurantList } from '@/presentation/pages'
import { LoadRestaurantsSpy } from '@/presentation/test'
import { ApiContext } from '@/presentation/contexts'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'
import { Router } from 'react-router-dom'
import { createMemoryHistory, MemoryHistory } from 'history'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

type SutTypes = {
  loadRestaurantsSpy: LoadRestaurantsSpy
  history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
}

const makeSut = (loadRestaurantsSpy = new LoadRestaurantsSpy()): SutTypes => {
  const history = createMemoryHistory()
  const setCurrentAccountMock = jest.fn()
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock }}>
      <Router history={history}>
        <RestaurantList loadRestaurants={loadRestaurantsSpy} />
      </Router>
    </ApiContext.Provider>
  )
  return {
    loadRestaurantsSpy,
    history,
    setCurrentAccountMock
  }
}

describe('RestaurantList Component', () => {
  test('Should present Loading on start', async () => {
    makeSut()
    const restaurantList = screen.getByTestId('restaurant-list')
    expect(restaurantList.querySelectorAll('li')).toHaveLength(0)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    await waitFor(() => restaurantList)
  })
  test('Should call LoadRestaurants', async () => {
    const { loadRestaurantsSpy } = makeSut()
    expect(loadRestaurantsSpy.callsCount).toBe(1)
    await waitFor(() => screen.getByRole('heading'))
  })
  test('Should render RestaurantItems on success', async () => {
    makeSut()
    const restaurantList = screen.getByTestId('restaurant-list')
    await waitFor(() => restaurantList)
    expect(restaurantList.querySelectorAll('li.restaurantItemWrap')).toHaveLength(1)
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
  })
  test('Should render error on UnexpectedError', async () => {
    const loadRestaurantsSpy = new LoadRestaurantsSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadRestaurantsSpy, 'loadAll').mockRejectedValueOnce(error)
    makeSut(loadRestaurantsSpy)
    await waitFor(() => screen.getByRole('heading'))
    expect(screen.queryByTestId('error')).toHaveTextContent(error.message)
  })
  test('Should logout on AccessDeniedError', async () => {
    const loadRestaurantsSpy = new LoadRestaurantsSpy()
    jest.spyOn(loadRestaurantsSpy, 'loadAll').mockRejectedValueOnce(new AccessDeniedError())
    const { setCurrentAccountMock, history } = makeSut(loadRestaurantsSpy)
    await waitFor(() => screen.getByRole('heading'))
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })
  test('Should call LoadSurveyList on reload', async () => {
    const loadRestaurantsSpy = new LoadRestaurantsSpy()
    jest.spyOn(loadRestaurantsSpy, 'loadAll').mockRejectedValueOnce(new UnexpectedError())
    makeSut(loadRestaurantsSpy)
    await waitFor(() => screen.getByRole('heading'))
    fireEvent.click(screen.getByTestId('reload'))
    expect(loadRestaurantsSpy.callsCount).toBe(1)
    await waitFor(() => screen.getByRole('heading'))
    expect(screen.getByTestId('restaurant-list')).toBeInTheDocument()
  })
})
