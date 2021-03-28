import React from 'react'
import { Router } from 'react-router-dom'
import { ApiContext } from '@/presentation/contexts'
import { createMemoryHistory, MemoryHistory } from 'history'
import { fireEvent, render, screen, waitFor, act } from '@testing-library/react'
import { AddOrderSpy, LoadOrdersSpy, mockAccountModel, mockAccountRestaurantModel, mockOrderModel, UpdateOrderStatusSpy } from '@/domain/test'
import { AccountModel } from '@/domain/models'
import { OrderList } from '..'
import { AccessDeniedError, UnexpectedError } from '@/domain/errors'

type SutTypes = {
  loadOrdersSpy: LoadOrdersSpy
  addOrderSpy: AddOrderSpy
  history: MemoryHistory
  setCurrentAccountMock: (account: AccountModel) => void
  updateOrderStatusSpy: UpdateOrderStatusSpy
}

const makeSut = (loadOrdersSpy = new LoadOrdersSpy()): SutTypes => {
  const history = createMemoryHistory({ initialEntries: ['/', '/orders/any_id'], initialIndex: 1 })
  const setCurrentAccountMock = jest.fn()
  const addOrderSpy = new AddOrderSpy()
  const updateOrderStatusSpy = new UpdateOrderStatusSpy()
  render(
    <ApiContext.Provider value={{ setCurrentAccount: setCurrentAccountMock, getCurrentAccount: () => mockAccountRestaurantModel(), addOrder: addOrderSpy }}>
      <Router history={history}>
        <OrderList loadOrders={loadOrdersSpy} updateOrderStatus={updateOrderStatusSpy} />
      </Router>
    </ApiContext.Provider>
  )
  return { loadOrdersSpy, history, setCurrentAccountMock, addOrderSpy, updateOrderStatusSpy }
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
  test('Should show order order-item-status-created if user is restaurant and status of order is CRIADA', async () => {
    const order = mockOrderModel()
    order.status = 'CRIADA'
    const loadOrdersSpy = new LoadOrdersSpy()
    loadOrdersSpy.orders = [order]
    makeSut(loadOrdersSpy)
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('order-item-status-created')).toBeInTheDocument()
  })
  test('Should show order order-item-status-approved if user is restaurant and status of order is APROVADA', async () => {
    const order = mockOrderModel()
    order.status = 'APROVADA'
    const loadOrdersSpy = new LoadOrdersSpy()
    loadOrdersSpy.orders = [order]
    makeSut(loadOrdersSpy)
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('order-item-status-approved')).toBeInTheDocument()
  })
  test('Should call UpdateOrderStatus with correct values if order is CRIADA', async () => {
    const order = mockOrderModel()
    order.status = 'CRIADA'
    const loadOrdersSpy = new LoadOrdersSpy()
    loadOrdersSpy.orders = [order]
    const { updateOrderStatusSpy } = makeSut(loadOrdersSpy)
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('approve-order'))
    expect(updateOrderStatusSpy.params).toEqual({
      orderId: order.id,
      status: 2
    })
  })
  test('Should call UpdateOrderStatus with correct values if order is CRIADA and order is canceled', async () => {
    const order = mockOrderModel()
    order.status = 'CRIADA'
    const loadOrdersSpy = new LoadOrdersSpy()
    loadOrdersSpy.orders = [order]
    const { updateOrderStatusSpy } = makeSut(loadOrdersSpy)
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('cancel-order'))
    expect(updateOrderStatusSpy.params).toEqual({
      orderId: order.id,
      status: 5
    })
  })
  test('Should call UpdateOrderStatus with correct values if order is APROVADA', async () => {
    const order = mockOrderModel()
    order.status = 'APROVADA'
    const loadOrdersSpy = new LoadOrdersSpy()
    loadOrdersSpy.orders = [order]
    const { updateOrderStatusSpy } = makeSut(loadOrdersSpy)
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('complete-order'))
    expect(updateOrderStatusSpy.params).toEqual({
      orderId: order.id,
      status: 4
    })
  })
  test('Should call UpdateOrderStatus with correct values if order is CRIADA and order is canceled', async () => {
    const order = mockOrderModel()
    order.status = 'APROVADA'
    const loadOrdersSpy = new LoadOrdersSpy()
    loadOrdersSpy.orders = [order]
    const { updateOrderStatusSpy } = makeSut(loadOrdersSpy)
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('cancel-order'))
    expect(updateOrderStatusSpy.params).toEqual({
      orderId: order.id,
      status: 5
    })
  })
  test('Should present error if UpdateOrderStatus throw an error', async () => {
    const order = mockOrderModel()
    order.status = 'APROVADA'
    const loadOrdersSpy = new LoadOrdersSpy()
    loadOrdersSpy.orders = [order]
    const { updateOrderStatusSpy } = makeSut(loadOrdersSpy)
    const error = new UnexpectedError()
    jest.spyOn(updateOrderStatusSpy, 'updateOrderStatus').mockRejectedValueOnce(error)
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('cancel-order'))
    await waitFor(() => screen.getByTestId('header'))
    expect(screen.getByTestId('error')).toHaveTextContent(error.message)
  })
  test('Should reload order page if UpdateOrderStatus succeds', async () => {
    const order = mockOrderModel()
    order.status = 'APROVADA'
    const loadOrdersSpy = new LoadOrdersSpy()
    loadOrdersSpy.orders = [order]
    makeSut(loadOrdersSpy)
    await waitFor(() => screen.getByTestId('header'))
    fireEvent.click(screen.getByTestId('cancel-order'))
    await waitFor(() => screen.getByTestId('header'))
    expect(loadOrdersSpy.callsCount).toEqual(4)
  })
})
