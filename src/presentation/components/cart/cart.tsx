import React from 'react'
import Styles from './cart-styles.scss'

const Cart: React.FC = () => {
  return (
    <div className={Styles.cartWrap}>
      <section className={Styles.cartTitle}>
        <span>Seu pedido em</span>
        <h2>Pizza Cesar - Aguas Claras</h2>
      </section>
      <section className={Styles.cartOrder}>
        <div>
          <span>1x Pizza broto 20 cm (sem borda recheada)</span>
          <strong>R$ 44,90</strong>
        </div>
        <div>
          <button type="button" className={Styles.editButton}>Editar</button>
          <button type="button" className={Styles.removeButton} >Remover</button>
        </div>
      </section>
      <section className={Styles.cartPrice}>
        <div className={Styles.subTotal}>
          <span>Subtotal</span>
          <span>R$ 44,90</span>
        </div>
        <div className={Styles.deliveryFee}>
          <span>Taxa de entrega</span>
          <span>R$ 6,99</span>
        </div>
        <div className={Styles.total}>
          <strong>Total</strong>
          <span>R$ 51,89</span>
        </div>
      </section>
      <button>Finalizar</button>
    </div>
  )
}

export default Cart
