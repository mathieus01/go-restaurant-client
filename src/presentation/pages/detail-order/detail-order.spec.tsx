import React from 'react'
import { ApiContext } from '@/presentation/contexts'
import { AddOrderSpy, LoadOrderByIdSpy, mockAccountModel } from '@/domain/test'
import { createMemoryHistory, MemoryHistory } from 'history'
import { fireEvent, render, screen, waitFor, act } from '@testing-library/react'
import { Router } from 'react-router-dom'
import MockDate from 'mockdate'
import { AccountModel } from '@/domain/models'
import { DetailOrder } from '..'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'

type SutTypes = {
  loadOrderByIdSpy: LoadOrderByIdSpy
  addOrderSpy: AddOrderSpy
  history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
}

const makeSut = (loadOrderByIdSpy = new LoadOrderByIdSpy()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/', '/orders/any_id'], initialIndex: 1 })
  const setCurrentAccountMock = jest.fn()
  const addOrderSpy = new AddOrderSpy()
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock, getCurrentAccount: () => mockAccountModel(), addOrder: addOrderSpy }}>
      <Router history={history}>
        <DetailOrder loadOrderById={loadOrderByIdSpy} />
      </Router>
    </ApiContext.Provider>
  )
  return { loadOrderByIdSpy, history, setCurrentAccountMock, addOrderSpy }
}

describe('DetailPage Component', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should present correct initial state', () => {
    makeSut()
    expect(screen.getByTestId('loading')).toBeInTheDocument()
    expect(screen.queryByTestId('order-container')).not.toBeInTheDocument()
  })
  test('Should call loadOrderById on start', async () => {
    const { loadOrderByIdSpy } = makeSut()
    expect(loadOrderByIdSpy.callsCount).toBe(1)
    await waitFor(() => screen.getByTestId('header'))
  })
  test('Should render Order on success', async () => {
    makeSut()
    await waitFor(() => screen.getByTestId('header'))
    const orderContainer = screen.getByTestId('order-container')
    expect(orderContainer).toBeInTheDocument()
    expect(screen.queryByTestId('error')).not.toBeInTheDocument()
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument()
  })
  test('Should render error on UnexpectedError', async () => {
    const loadOrderByIdSpy = new LoadOrderByIdSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadOrderByIdSpy, 'loadById').mockRejectedValueOnce(error)
    makeSut(loadOrderByIdSpy)
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
  })
  test('Should logout on AccessDeniedError', async () => {
    const loadOrderByIdSpy = new LoadOrderByIdSpy()
    jest.spyOn(loadOrderByIdSpy, 'loadById').mockRejectedValueOnce(new AccessDeniedError())
    const { setCurrentAccountMock, history } = makeSut(loadOrderByIdSpy)
    await waitFor(() => screen.getByTestId('header'))
    expect(setCurrentAccountMock).toHaveBeenCalledWith(undefined)
    expect(history.location.pathname).toBe('/login')
  })
  test('Should call LoadOrderById on reload', async () => {
    const loadOrderByIdSpy = new LoadOrderByIdSpy()
    const error = new UnexpectedError()
    jest.spyOn(loadOrderByIdSpy, 'loadById').mockRejectedValueOnce(error)
    makeSut(loadOrderByIdSpy)
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
    fireEvent.click(screen.getByTestId('reload'))
    expect(loadOrderByIdSpy.callsCount).toBe(2)
    await waitFor(() => screen.getByTestId('header'))
  })
})
