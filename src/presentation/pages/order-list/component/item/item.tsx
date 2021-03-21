import { LoadOrders } from '@/domain/usecases'
import React from 'react'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import Styles from './item-styles.scss'

type Props = {
  order: LoadOrders.Model
}

const Item: React.FC<Props> = ({ order }: Props) => {
  const restaurant = order.foodsOrder[0].food.restaurant
  const history = useHistory()

  const goToDetail = (): void => {
    history.replace(`/orders/${order.id}`)
  }

  return (
    <li className={Styles.orderItemWrap} onClick={goToDetail}>
      <div className={Styles.orderDateWrapper}>
        <div className={Styles.orderDate}>
          <span className={Styles.day}>{moment(order.date).format('DD')}</span>
          <span className={Styles.month}>{moment(order.date).format('MMM')}</span>
        </div>
      </div>
      <div className={Styles.orderDetail}>
        <h2>{restaurant.name}</h2>
        {order.foodsOrder.map(foodOrder => (
          <span key={foodOrder.id}>{foodOrder.amount}x {foodOrder.food.name} </span>
        ))}
        <h4>Status: {order.status}</h4>
      </div>
    </li>
  )
}

export default Item
