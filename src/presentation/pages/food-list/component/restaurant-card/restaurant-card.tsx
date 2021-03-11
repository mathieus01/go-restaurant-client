import React from 'react'
import { FiStar, FiDollarSign } from 'react-icons/fi'
import Styles from './restaurant-card-styles.scss'

const RestaurantCard: React.FC = () => {
  const cover = 'https://www.sheknows.com/wp-content/uploads/2020/06/best-picnic-food-cover-amazon.jpg?w=1920'
  const url = 'https://static-images.ifood.com.br/image/upload/t_thumbnail/logosgde/201811121553_0db84528-bab8-4883-ba40-8fe6856ff1b1.jpg'
  return (
    <section className={Styles.restaurantWrap}>
      <img src={cover} alt="cover" className={Styles.coverImage}/>
      <div className={Styles.restaurantContent}>
        <img src={url} alt="restaurant_logo" className={Styles.restaurantLogo}/>
        <div className={Styles.restaurantInfo}>
          <div className={Styles.restaurantName}>
            <h2>Pizza Cesar - Aguas Claras</h2>
            <h4><FiStar size={10} /> 5.0</h4>
          </div>
          <div className={Styles.restaurantMoreInfo}>
            <span>Ver mais</span>
            <span><FiDollarSign size={14} />Pedido minimo R$10,00</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RestaurantCard
