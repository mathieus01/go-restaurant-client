import React, { useState, useEffect, useContext } from 'react'
import { List } from './components'
import { ApiContext } from '@/presentation/contexts'
import { Error, Header } from '@/presentation/components'
import { LoadRestaurants } from '@/domain/usecases'
import { AccessDeniedError } from '@/domain/errors'
import { useHistory } from 'react-router-dom'
import Styles from './restaurant-list-styles.scss'

type Props = {
  loadRestaurants: LoadRestaurants
}

const RestaurantList: React.FC<Props> = ({ loadRestaurants }: Props) => {
  const { setCurrentAccount } = useContext(ApiContext)
  const history = useHistory()
  const [state, setState] = useState({
    restaurants: [] as LoadRestaurants.Model[],
    error: '',
    reload: false
  })

  useEffect(() => {
    loadRestaurants.loadAll()
      .then(restaurants => setState(old => ({ ...old, restaurants })))
      .catch(handleError)
  }, [state.reload])

  const handleError = (error: Error): void => {
    if (error instanceof AccessDeniedError) {
      setCurrentAccount(undefined)
      history.replace('/login')
    } else {
      setState(old => ({ ...old, error: error.message }))
    }
  }

  const reload = (): void => {
    setState(old => ({ restaurants: [], error: '', reload: !old.reload }))
  }

  return (
    <div className={Styles.restaurantListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
        <h2>Restaurantes</h2>
        {state.error
          ? <Error error={state.error} reload={reload} />
          : <List restaurants={state.restaurants} />
        }
      </div>
    </div>
  )
}

export default RestaurantList
