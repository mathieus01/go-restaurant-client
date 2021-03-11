import React from 'react'
import { FoodModel } from '@/domain/models'
import { FoodItem } from '@/presentation/pages/food-list/component'
import Styles from './list-styles.scss'

type Props = {
  foods: FoodModel[]
}

const List: React.FC<Props> = ({ foods }: Props) => {
  return (
    <ul className={Styles.foodListWrap} data-testid="food-list">
      {foods.length && foods.map(food => (
        <FoodItem key={food.id} food={food} />
      )) }
    </ul>
  )
}

export default List
