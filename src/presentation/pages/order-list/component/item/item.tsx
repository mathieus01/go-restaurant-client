import React, { useContext } from 'react'
import { LoadOrders } from '@/domain/usecases'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import Styles from './item-styles.scss'
import { ApiContext, OrderContext } from '@/presentation/contexts'

type Props = {
  order: LoadOrders.Model
}

const Item: React.FC<Props> = ({ order }: Props) => {
  const { updateOrderStatus, handleError, reload } = useContext(OrderContext)
  const { getCurrentAccount } = useContext(ApiContext)
  const restaurant = order.foodsOrder[0].food.restaurant
  const history = useHistory()

  const goToDetail = (): void => {
    history.replace(`/orders/${order.id}`)
  }

  const handleUpdateOrderStatus = (orderId: number, status: number): void => {
    updateOrderStatus.updateOrderStatus({
      orderId,
      status
    })
      .then(reload)
      .catch(handleError)
  }

  return (
    <li className={Styles.orderItemWrap}>
      <div className={Styles.orderItemContent} onClick={goToDetail}>
        <div className={Styles.orderDateWrapper}>
          <div className={Styles.orderDate}>
            <span className={Styles.day}>{moment(order.date).format('DD')}</span>
            <span className={Styles.month}>{moment(order.date).format('MMM')}</span>
          </div>
        </div>
        <div className={Styles.orderDetail}>
          <h2 className={Styles.restaurantName}>{restaurant.name}</h2>
          {order.foodsOrder.map(foodOrder => (
            <span key={foodOrder.id}>{foodOrder.amount}x {foodOrder.food.name} </span>
          ))}
          <h4>Status: <strong>{order.status}</strong></h4>
        </div>
      </div>
      {getCurrentAccount().isRestaurant && order.status === 'CRIADA' && (
        <div className={Styles.orderItemFooter} data-testid="order-item-status-created">
          <button data-testid="approve-order" onClick={async e => await handleUpdateOrderStatus(order.id, 2)}>Aprovar</button>
          <button data-testid="cancel-order" onClick={async e => await handleUpdateOrderStatus(order.id, 5)}>Recusar</button>
        </div>
      )}
      {getCurrentAccount().isRestaurant && order.status === 'APROVADA' && (
        <div className={Styles.orderItemFooter} data-testid="order-item-status-approved">
          <button data-testid="complete-order" onClick={async e => await handleUpdateOrderStatus(order.id, 4)}>Concluir Pedido</button>
          <button data-testid="cancel-order" onClick={async e => await handleUpdateOrderStatus(order.id, 5)}>Cancelar Pedido</button>
        </div>
      )}
    </li>
  )
}

export default Item
