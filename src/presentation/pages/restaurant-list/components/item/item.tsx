import { LoadRestaurants } from '@/domain/usecases'
import React from 'react'
import { FiStar } from 'react-icons/fi'
import Styles from './item-styles.scss'

type Props = {
  restaurant: LoadRestaurants.Model
}

const Item: React.FC<Props> = ({ restaurant }: Props) => {
  const url = 'https://static-images.ifood.com.br/image/upload/t_thumbnail/logosgde/201811121553_0db84528-bab8-4883-ba40-8fe6856ff1b1.jpg'
  return (
    <li className={Styles.restaurantItemWrap}>
      <div className={Styles.restaurantCard}>
        <div className={Styles.restaurantFigure}>
          <img data-testid="restaurant-img" src={restaurant.image} alt="restaurant"/>
        </div>
        <div className={Styles.cardInfo}>
          <h3>
            <span data-testid="restaurant-name" className={Styles.restaurantName}>{restaurant.name}</span>
            <div className={Styles.restaurantInfo}>
              <span><FiStar size={10} /> 5.0</span>
              <span data-testid="restaurant-type">{restaurant.type}</span>
              <span>{restaurant.address}</span>
            </div>
          </h3>
          <div className={Styles.restaurantFooter}>
            <span>Hoje, a partir das 12:00 R$ 6.99</span>
          </div>
        </div>
      </div>
    </li>
  )
}

export default Item
