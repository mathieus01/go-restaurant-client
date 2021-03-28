import React, { useState, useEffect } from 'react'
import { LoadOrders, UpdateOrderStatus } from '@/domain/usecases'
import { Error, Header } from '@/presentation/components'
import Styles from './order-list-styles.scss'
import { List } from './component'
import { useErrorHandler } from '@/presentation/hooks'
import { OrderContext } from '@/presentation/contexts'

type Props = {
  loadOrders: LoadOrders
  updateOrderStatus: UpdateOrderStatus
}

const OrderList: React.FC<Props> = ({ loadOrders, updateOrderStatus }: Props) => {
  const [state, setState] = useState({
    orders: [] as LoadOrders.Model[],
    error: '',
    reload: true
  })

  useEffect(() => {
    loadOrders.load()
      .then(orders => setState(old => ({ ...old, reload: false, orders })))
      .catch(handleError)
  }, [state.reload])

  const handleError = useErrorHandler((error: Error) => {
    setState(old => ({ ...old, reload: false, error: error.message }))
  })

  const reload = (): void => {
    setState(old => ({ orders: null, error: '', reload: !old.reload }))
  }

  return (
    <div className={Styles.orderListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
        <h2>Pedidos</h2>
        {state.error
          ? <Error error={state.error} reload={reload} />
          : (
            <OrderContext.Provider value={{ updateOrderStatus, handleError, reload }}>
              <List orders={state.orders} loading={state.reload} />
            </OrderContext.Provider>
          )
        }
      </div>
    </div>
  )
}

export default OrderList
