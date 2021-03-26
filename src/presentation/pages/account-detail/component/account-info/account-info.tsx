import React from 'react'
import Styles from './account-info-styles.scss'

const AccountInfo: React.FC = () => {
  const url = 'https://static-images.ifood.com.br/image/upload/t_thumbnail/logosgde/201811121553_0db84528-bab8-4883-ba40-8fe6856ff1b1.jpg'
  return (
    <>
      <h2>Seus dados</h2>
      <div className={Styles.restaurantCart}>
        <div className={Styles.restaurantTitle}>
          <img src={url} alt="avatar"/>
          <div className={Styles.restaurantInfo}>
            <h3 data-testid="restaurant-name">Pizza Cesar</h3>
            <span data-testid="restaurant-type">Pizzaria</span>
            <span data-testid="restaurant-address">Av. das Araucárias, Lote 4150 - Águas Claras, Brasília</span>
          </div>
        </div>
        <span>Descrição:</span>
        <span className={Styles.restaurantDescription} data-testid="restaurant-description">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas perspiciatis voluptates libero porro unde quidem iste possimus ea debitis quo.
        </span>
      </div>
    </>
  )
}

export default AccountInfo
