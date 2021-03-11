import React from 'react'
import Styles from './food-item-styles.scss'

const FoodItem: React.FC = () => {
  const foodImage = 'https://static-images.ifood.com.br/image/upload/t_low/pratos/0db84528-bab8-4883-ba40-8fe6856ff1b1/202001262144_fGUN_b.jpg'
  return (
    <li className={Styles.foodItemWrap}>
      <div>
        <h3>Pizza broto 20 cm (sem borda recheada)</h3>
        <span>Nossa pizza brotinho de 20 cm - (favor verifique se seu endereço está completo e com ponto de referência).</span>
        <strong>R$ 44,90</strong>
      </div>
      <img src={foodImage} alt="pizza"/>
    </li>
  )
}

export default FoodItem
