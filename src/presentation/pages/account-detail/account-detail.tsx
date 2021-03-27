import React, { useState, useEffect } from 'react'
import { Error, Header, Loading } from '@/presentation/components'
import Styles from './account-detail-styles.scss'
import { LoadFoodsByRestaurant, SaveFood } from '@/domain/usecases'
import { FiPlus } from 'react-icons/fi'
import { FormContext } from '@/presentation/contexts'
import { useErrorHandler } from '@/presentation/hooks'
import { AccountInfo, MenuList, SaveFood as SaveFoodComponent } from './component'
import { Validation } from '@/presentation/protocols'

type Props = {
  loadFoodsByRestaurant: LoadFoodsByRestaurant
  saveFood: SaveFood
  saveFoodValidation: Validation
}

const AccountDetail: React.FC<Props> = ({ loadFoodsByRestaurant, saveFoodValidation, saveFood }: Props) => {
  const [state, setState] = useState({
    isAddFood: false,
    foods: [] as LoadFoodsByRestaurant.Model[],
    error: '',
    reload: true
  })
  const [formState, setFormState] = useState({
    name: '',
    type: '',
    description: '',
    price: null as number,
    nameError: '',
    typeError: '',
    descriptionError: '',
    priceError: '',
    mainError: '',
    isFormInvalid: true,
    isLoading: false
  })
  useEffect(() => { validate('name') }, [formState.name])
  useEffect(() => { validate('type') }, [formState.type])
  useEffect(() => { validate('price') }, [formState.price])
  useEffect(() => { validate('description') }, [formState.description])

  const validate = (field: string): void => {
    const { name, type, price, description } = formState
    const formData = { name, type, price, description }
    setFormState(old => ({ ...old, [`${field}Error`]: saveFoodValidation.validate(field, formData) }))
    setFormState(old => ({ ...old, isFormInvalid: !!old.nameError || !!old.typeError || !!old.descriptionError || !!old.priceError }))
  }

  useEffect(() => {
    loadFoodsByRestaurant.loadByRestaurants()
      .then(foods => setState(old => ({ ...old, reload: false, foods })))
      .catch(handleError)
  }, [state.reload])

  const handleError = useErrorHandler((error: Error) => {
    setState(old => ({ ...old, reload: false, error: error.message }))
  })
  const handleSaveFoodError = useErrorHandler((error: Error) => {
    setFormState(old => ({ ...old, isLoading: false, mainError: error.message }))
  })

  const reload = (): void => {
    setState(old => ({ ...old, foods: null, error: '', reload: !old.reload, isAddFood: false }))
  }

  const toogleModal = (): void => {
    setState(old => ({ ...old, isAddFood: !old.isAddFood }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if (!formState.isLoading && !formState.isFormInvalid) {
      setFormState(old => ({ ...old, isLoading: true }))
      const { name, type, description, price } = formState
      await saveFood.save({
        name,
        type,
        description,
        price
      })
        .then(() => {
          setFormState(old => ({ ...old, isLoading: false, mainError: '' }))
          reload()
        })
        .catch(handleSaveFoodError)
    }
  }

  return (
    <div className={Styles.accountDetailWrap}>
      <Header />
      {state.reload
        ? <Loading className={Styles.loadingContainer} />
        : (
          <div className={Styles.container}>
            <div className={Styles.accountDetailContent} data-testid="restaurant-container">
              { state.error ? <Error error={state.error} reload={reload} />
                : (
                  <>
                    <AccountInfo />
                    <div className={Styles.restaurantFood}>
                      <div className={Styles.restaurantFoodTitle}>
                        <h2>Menu</h2>
                        <h3 onClick={e => toogleModal()} data-testid="show-save-food">
                          <FiPlus size={14} /> Novo item
                        </h3>
                      </div>
                      <MenuList foods={state.foods} />
                    </div>
                  </>
                ) }
            </div>
            {state.isAddFood && (
              <div className={Styles.saveFoodContent} data-testid="save-food-container">
                <FormContext.Provider value={{ state: formState, setState: setFormState }}>
                  <SaveFoodComponent
                    onSubmit={handleSubmit}
                    isFormInvalid={formState.isFormInvalid} />
                </FormContext.Provider>
              </div>
            )}
          </div>
        )
      }
    </div>
  )
}

export default AccountDetail
