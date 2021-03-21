import React, { useState, useEffect } from 'react'
import { LoadOrders } from '@/domain/usecases'
import { Error, Header } from '@/presentation/components'
import Styles from './order-list-styles.scss'
import { List } from './component'
import { useErrorHandler } from '@/presentation/hooks'

type Props = {
  loadOrders: LoadOrders
}

const OrderList: React.FC<Props> = ({ loadOrders }: Props) => {
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
          : <List orders={state.orders} loading={state.reload} />
        }
      </div>
    </div>
  )
}

export default OrderList
