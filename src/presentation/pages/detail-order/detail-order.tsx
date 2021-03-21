import React, { useState, useEffect } from 'react'
import { Error, Header, Spinner } from '@/presentation/components'
import { FiChevronLeft } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Styles from './detail-order-styles.scss'
import { LoadOrderById } from '@/domain/usecases'
import { useErrorHandler } from '@/presentation/hooks'

type Props = {
  loadOrderById: LoadOrderById
}

const DetailOrder: React.FC<Props> = ({ loadOrderById }: Props) => {
  const [state, setState] = useState({
    order: null,
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
                <h2>Outback - DF Plaza</h2>
                <Link to="/restaurant/1" className={Styles.menuLink}>
                Ver cardapio
                </Link>
                <h4>Previsão de entrega:</h4>
                <span>Hoje • 18:56 - 19:06</span>
              </section>
              <section className={Styles.foodSection}>
                <div className={Styles.foodItens}>
                  <h3>1x Turbine sua wings</h3>
                  <h3>R$ 59,50</h3>
                </div>
                <span>Nenhuma observacão</span>
              </section>
              <section className={Styles.addressSection}>
                <h3>Entrega em</h3>
                <span>Av. das Araucárias, Lote 4150 - Águas Claras, Brasília - DF, 71936-250</span>
              </section>
              <section className={Styles.orderSection}>
                <div className={Styles.orderNumber}>
                  <h3>N° do pedido</h3>
                  <span>4128</span>
                </div>
                <div className={Styles.orderDate}>
                  <h3>Data do pedido</h3>
                  <span>18/03/2021 • 18:23</span>
                </div>
                <div className={Styles.orderPayment}>
                  <h3>Pagamento</h3>
                  <span>Pagamento pelo site • Credito • Mastercard</span>
                </div>
                <div className={Styles.orderStatus}>
                  <h3>Status do pedido</h3>
                  <span>Confirmado</span>
                </div>
              </section>
              <section className={Styles.buttonsSection}>
                <Link to="/restaurant/1" className={Styles.menuLink}>
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
