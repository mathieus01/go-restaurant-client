import React from 'react'
import { FoodItem } from '..'
import Styles from './list-styles.scss'

const List: React.FC = () => {
  return (
    <ul className={Styles.foodListWrap}>
      <FoodItem />
      <FoodItem />
      <FoodItem />
      <FoodItem />
    </ul>
  )
}

export default List
