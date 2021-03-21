import React from 'react'
import { Spinner } from '@/presentation/components'
import { Item } from '@/presentation/pages/order-list/component'
import { LoadOrders } from '@/domain/usecases'
import Styles from './list-styles.scss'

type Props = {
  orders: LoadOrders.Model[]
  loading: boolean
}

const List: React.FC<Props> = ({ orders, loading }: Props) => {
  return (
    <>
      {loading
        ? <div className={Styles.loading} data-testid="loading">
          <Spinner />
        </div>
        : <ul className={Styles.listWrap} data-testid="orders-list">
          {orders.map(order =>
            <Item key={order.id} order={order} />
          )}
        </ul>
      }
    </>
  )
}

export default List
