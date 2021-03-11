import React from 'react'
import { LoadFoodsByRestaurant } from '@/domain/usecases'
import Styles from './food-item-styles.scss'

type Props = {
  food: LoadFoodsByRestaurant.Model
}

const FoodItem: React.FC<Props> = ({ food }: Props) => {
  const foodImage = 'https://static-images.ifood.com.br/image/upload/t_low/pratos/0db84528-bab8-4883-ba40-8fe6856ff1b1/202001262144_fGUN_b.jpg'
  return (
    <li className={Styles.foodItemWrap}>
      <div>
        <h3>{food.name}</h3>
        <span>{food.description}</span>
        <strong>R$ {food.price}</strong>
      </div>
      <img src={foodImage} alt="pizza"/>
    </li>
  )
}

export default FoodItem
