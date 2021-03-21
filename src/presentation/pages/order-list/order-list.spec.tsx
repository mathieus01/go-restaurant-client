import React from 'react'
import { Router } from 'react-router-dom'
import { ApiContext } from '@/presentation/contexts'
import { createMemoryHistory, MemoryHistory } from 'history'
import { fireEvent, render, screen, waitFor, act } from '@testing-library/react'
import { AddOrderSpy, LoadOrdersSpy, mockAccountModel } from '@/domain/test'
import { AccountModel } from '@/domain/models'
import { OrderList } from '..'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'

type SutTypes = {
  loadOrdersSpy: LoadOrdersSpy
  addOrderSpy: AddOrderSpy
  history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
}

const makeSut = (loadOrdersSpy = new LoadOrdersSpy()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/', '/orders/any_id'], initialIndex: 1 })
  const setCurrentAccountMock = jest.fn()
  const addOrderSpy = new AddOrderSpy()
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock, getCurrentAccount: () => mockAccountModel(), addOrder: addOrderSpy }}>
      <Router history={history}>
        <OrderList loadOrders={loadOrdersSpy} />
      </Router>
    </ApiContext.Provider>
  )
  return { loadOrdersSpy, history, setCurrentAccountMock, addOrderSpy }
}

describe('OrderList Component', () => {
  test('Should present correct initial state', () => {
    makeSut()
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.queryByTestId('orders-list')).not.toBeInTheDocument()
  })
  test('Should call loadOrders on start', async () => {
    const { loadOrdersSpy } = makeSut()
    expect(loadOrdersSpy.callsCount).toBe(1)
    await waitFor(() => screen.getByTestId('header'))
  })
  test('Should render list of Order on success', async () => {
    makeSut()
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('orders-list')).toBeInTheDocument()
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })
  test('Should render error on UnexpectedError', async () => {
    const loadOrdersSpy = new LoadOrdersSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadOrdersSpy, 'load').mockRejectedValueOnce(error)
    makeSut(loadOrdersSpy)
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
  })
  test('Should logout on AccessDeniedError', async () => {
    const loadOrdersSpy = new LoadOrdersSpy()
    jest.spyOn(loadOrdersSpy, 'load').mockRejectedValueOnce(new AccessDeniedError())
    const { setCurrentAccountMock, history } = makeSut(loadOrdersSpy)
    await waitFor(() => screen.getByTestId('header'))
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })
  test('Should call LoadOrders on reload', async () => {
    const loadOrdersSpy = new LoadOrdersSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadOrdersSpy, 'load').mockRejectedValueOnce(error)
    makeSut(loadOrdersSpy)
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
    fireEvent.click(screen.getByTestId('reload'))
    expect(loadOrdersSpy.callsCount).toBe(2)
    await waitFor(() => screen.getByTestId('header'))
  })
})
