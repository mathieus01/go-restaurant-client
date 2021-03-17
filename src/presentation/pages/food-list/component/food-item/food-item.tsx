import React, { useContext } from 'react'
import { CartContext } from '@/presentation/contexts'
import { LoadFoodsByRestaurant } from '@/domain/usecases'
import Styles from './food-item-styles.scss'
import { FoodModel } from '@/domain/models'

type Props = {
  food: LoadFoodsByRestaurant.Model
}

const FoodItem: React.FC<Props> = ({ food }: Props) => {
  const { cart, setCart } = useContext(CartContext)
  const foodImage = 'https://static-images.ifood.com.br/image/upload/t_low/pratos/0db84528-bab8-4883-ba40-8fe6856ff1b1/202001262144_fGUN_b.jpg'

  const addFood = (food: FoodModel): void => {
    const newFood = { ...food, amount: 1 }
    const foods = cart.foods.filter(foodCart => foodCart.id !== food.id)
    setCart(old => ({ ...old, foods: [...foods, newFood] }))
  }
  return (
    <li data-testid="food-item" className={Styles.foodItemWrap} onClick={e => addFood(food)}>
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
