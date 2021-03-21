import React, { useState, useEffect } from 'react'
import { Error, Header, Spinner } from '@/presentation/components'
import { FiChevronLeft } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Styles from './detail-order-styles.scss'
import { LoadOrderById } from '@/domain/usecases'
import { useErrorHandler } from '@/presentation/hooks'
import moment from 'moment'

type Props = {
  loadOrderById: LoadOrderById
}

const DetailOrder: React.FC<Props> = ({ loadOrderById }: Props) => {
  const [state, setState] = useState({
    order: null as LoadOrderById.Model,
    error: '',
    reload: true
  })

  useEffect(() => {
    loadOrderById.loadById()
      .then(order => setState(old => ({ ...old, reload: false, order })))
      .catch(handleError)
  }, [state.reload])

  const handleError = useErrorHandler((error: Error) => {
    setState(old => ({ ...old, reload: false, error: error.message }))
  })

  const reload = (): void => {
    setState(old => ({ order: null, error: '', reload: !old.reload }))
  }

  return (
    <div className={Styles.detailOrderWrap}>
      <Header />
      {state.reload
        ? <div className={Styles.loadingContainer} data-testid="loading">
          <Spinner />
        </div>
        : <div className={Styles.detailOrderContent} data-testid="order-container">
          { !state.error
            ? <>
              <section className={Styles.restaurantSection}>
                <Link to="/orders" >
                  <FiChevronLeft size={16} /> Pedidos
                </Link>
                <h2>{state.order.foodsOrder[0].food.restaurant.name}</h2>
                <Link to={`/restaurants/${state.order.foodsOrder[0].food.restaurant.id}`} className={Styles.menuLink}>
                Ver cardapio
                </Link>
                <h4>Previsão de entrega:</h4>
                <span>Hoje • 18:56 - 19:06</span>
              </section>
              {state.order.foodsOrder.map(foodOrder => (
                <section className={Styles.foodSection} key={foodOrder.id}>
                  <div className={Styles.foodItens}>
                    <h3>{foodOrder.amount}x {foodOrder.food.name}</h3>
                    <h3>R$ {foodOrder.food.price}</h3>
                  </div>
                  <span>{foodOrder.observation}</span>
                </section>
              ))}
              <section className={Styles.addressSection}>
                <h3>Entrega em</h3>
                <span>{state.order.address}</span>
              </section>
              <section className={Styles.orderSection}>
                <div className={Styles.orderNumber}>
                  <h3>N° do pedido</h3>
                  <span>{state.order.id}</span>
                </div>
                <div className={Styles.orderDate}>
                  <h3>Data do pedido</h3>
                  <span>{moment().format('DD/MM/YYYY • hh:mm')}</span>
                </div>
                <div className={Styles.orderPayment}>
                  <h3>Pagamento</h3>
                  <span>Pagamento pelo site • Credito • Mastercard</span>
                </div>
                <div className={Styles.orderStatus}>
                  <h3>Status do pedido</h3>
                  <span>{state.order.status}</span>
                </div>
              </section>
              <section className={Styles.buttonsSection}>
                <Link to={`/restaurants/${state.order.foodsOrder[0].food.restaurant.id}`} className={Styles.menuLink}>
                  Ver cardapio
                </Link>
                <button>Acompanhar pedido</button>
              </section>
            </>
            : <Error error={state.error} reload={reload} />
          }
        </div>
      }
    </div>
  )
}

export default DetailOrder
