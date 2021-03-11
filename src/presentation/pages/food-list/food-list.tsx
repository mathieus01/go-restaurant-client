import React, { useEffect, useState } from 'react'
import { Error, Header } from '@/presentation/components'
import { useErrorHandler } from '@/presentation/hooks'
import { List, RestaurantCard } from './component'
import { LoadFoodsByRestaurant } from '@/domain/usecases'
import Styles from './food-list-styles.scss'

type Props = {
  loadFoodsByRestaurant: LoadFoodsByRestaurant
}

const FoodList: React.FC<Props> = ({ loadFoodsByRestaurant }: Props) => {
  const [state, setState] = useState({
    foods: [] as LoadFoodsByRestaurant.Model[],
    error: '',
    reload: false
  })

  useEffect(() => {
    loadFoodsByRestaurant.loadByRestaurants()
      .then(foods => setState(old => ({ ...old, foods })))
      .catch(handleError)
  }, [state.reload])

  const reload = (): void => {
    setState(old => ({ foods: [], error: '', reload: !old.reload }))
  }

  const handleError = useErrorHandler((error: Error) => {
    setState(old => ({ ...old, error: error.message }))
  })

  return (
    <div className={Styles.foodListWrap}>
      <Header />
      <div className={Styles.contentWrap}>
        <RestaurantCard />
        <input type="text" placeholder="Buscar no cardápio" name='filter' />
        <h2>Pizzas</h2>
        {state.error
          ? <Error error={state.error} reload={reload} />
          : <List foods={state.foods} />
        }
      </div>
    </div>
  )
}

export default FoodList
