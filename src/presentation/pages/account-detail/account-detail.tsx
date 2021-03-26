import React, { useState, useEffect } from 'react'
import { Error, Header, Loading } from '@/presentation/components'
import Styles from './account-detail-styles.scss'
import { LoadFoodsByRestaurant } from '@/domain/usecases'
import { FiPlus } from 'react-icons/fi'
import { FormContext } from '@/presentation/contexts'
import { useErrorHandler } from '@/presentation/hooks'
import { AccountInfo, MenuList, SaveFood } from './component'

type Props = {
  loadFoodsByRestaurant: LoadFoodsByRestaurant
}

const AccountDetail: React.FC<Props> = ({ loadFoodsByRestaurant }: Props) => {
  const [state, setState] = useState({
    isAddFood: false,
    foods: [] as LoadFoodsByRestaurant.Model[],
    error: '',
    reload: true
  })
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    price: '',
    nameError: '',
    descriptionError: '',
    priceError: ''
  })

  useEffect(() => {
    loadFoodsByRestaurant.loadByRestaurants()
      .then(foods => setState(old => ({ ...old, reload: false, foods })))
      .catch(handleError)
  }, [state.reload])

  const handleError = useErrorHandler((error: Error) => {
    setState(old => ({ ...old, reload: false, error: error.message }))
  })

  const reload = (): void => {
    setState(old => ({ foods: null, error: '', reload: !old.reload, isAddFood: false }))
  }

  const toogleModal = (): void => {
    setState(old => ({ ...old, isAddFood: !old.isAddFood }))
  }

  return (
    <div className={Styles.accountDetailWrap}>
      <Header />
      {state.reload
        ? <Loading className={Styles.loadingContainer} />
        : (
          <div className={Styles.accountDetailContent} data-testid="restaurant-container">
            { state.error ? <Error error={state.error} reload={reload} />
              : (
                <>
                  <AccountInfo />
                  <div className={Styles.restaurantFood}>
                    <div className={Styles.restaurantFoodTitle}>
                      <h2>Menu</h2>
                      <h3 onClick={e => toogleModal()}>
                        <FiPlus size={14} /> Novo item
                      </h3>
                    </div>
                    {state.isAddFood && (
                      <FormContext.Provider value={{ state: formState, setState: setFormState }}>
                        <SaveFood />
                      </FormContext.Provider>
                    )}
                    <MenuList foods={state.foods} />
                  </div>
                </>
              ) }
          </div>
        )
      }
    </div>
  )
}

export default AccountDetail
