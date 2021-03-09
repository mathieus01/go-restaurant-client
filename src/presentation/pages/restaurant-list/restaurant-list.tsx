import React from 'react'
import Styles from './restaurant-list-styles.scss'
import { Header } from '@/presentation/components'
import { List } from './components'

const RestaurantList: React.FC = () => {
  return (
    <div className={Styles.restaurantListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
        <h2>Restaurantes</h2>
        <List />
      </div>
    </div>
  )
}

export default RestaurantList
