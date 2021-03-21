import React from 'react'
import { makeRemoteLoadOrders } from '@/main/factories/usecases'
import { OrderList } from '@/presentation/pages'

export const makeOrderList: React.FC = () => {
  return (
    <OrderList loadOrders={makeRemoteLoadOrders()} />
  )
}
