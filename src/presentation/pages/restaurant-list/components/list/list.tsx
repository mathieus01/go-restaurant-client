import { LoadRestaurants } from '@/domain/usecases'
import React from 'react'
import Item from '../item/item'
import Styles from './list-styles.scss'

type Props = {
  restaurants: LoadRestaurants.Model[]
}

const List: React.FC<Props> = ({ restaurants }: Props) => {
  return (
    <ul className={Styles.listWrap} data-testid="restaurant-list">
      { restaurants &&
      restaurants.map(restaurant => (
        <Item key={restaurant.id} restaurant={restaurant} />
      ))}
    </ul>
  )
}

export default List
