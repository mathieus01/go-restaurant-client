import { LoadFoodsByRestaurant } from '@/domain/usecases'
import React from 'react'
import Styles from './menu-item-styles.scss'

type Props = {
  food: LoadFoodsByRestaurant.Model
}

const MenuItem: React.FC<Props> = ({ food }: Props) => {
  const foodImage = 'https://static-images.ifood.com.br/image/upload/t_low/pratos/0db84528-bab8-4883-ba40-8fe6856ff1b1/202001262144_fGUN_b.jpg'
  return (
    <li className={Styles.restaurantFoodItem} key={food.id}>
      <img src={foodImage} alt="food"/>
      <div>
        <h3 data-testid="food-name">{food.name}</h3>
        <span data-testid="food-description">{food.description}</span>
        <strong data-testid="food-price">{`R$ ${food.price},00`}</strong>
      </div>
    </li>
  )
}

export default MenuItem
