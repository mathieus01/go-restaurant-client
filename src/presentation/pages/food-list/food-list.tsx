import React from 'react'
import { Header } from '@/presentation/components'
import { List, RestaurantCard } from './component'
import Styles from './food-list-styles.scss'

const FoodList: React.FC = () => {
  return (
    <div className={Styles.foodListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
        <RestaurantCard />
        <input type="text" placeholder="Buscar no cardápio" />
        <h2>Pizzas</h2>
        <List />
      </div>
    </div>
  )
}

export default FoodList
