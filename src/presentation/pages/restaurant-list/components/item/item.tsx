import React from 'react'
import { FiStar } from 'react-icons/fi'
import Styles from './item-styles.scss'

const Item: React.FC = () => {
  const url = 'https://static-images.ifood.com.br/image/upload/t_thumbnail/logosgde/201811121553_0db84528-bab8-4883-ba40-8fe6856ff1b1.jpg'
  return (
    <li className={Styles.restaurantItemWrap}>
      <div className={Styles.restaurantCard}>
        <div className={Styles.restaurantFigure}>
          <img src={url} alt="restaurant"/>
        </div>
        <div className={Styles.cardInfo}>
          <h3>
            <span className={Styles.restaurantName}>Pizza Cesar - Aguas Claras</span>
            <div className={Styles.restaurantInfo}>
              <span><FiStar size={10} /> 4.3</span>
              <span>Pizza</span>
              <span>3.1 km</span>
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
