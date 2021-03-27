import React from 'react'
import { makeRemoteLoadFoodsByRestaurant, makeRemoteSaveFood } from '@/main/factories/usecases'
import { AccountDetail } from '@/presentation/pages'
import { getCurrentAccountAdapter } from '@/main/adapters'
import { makeSaveFoodValidation } from './save-food-validation-factory'

export const makeAccountDetail: React.FC = () => {
  const { id } = getCurrentAccountAdapter()
  return (
    <AccountDetail
      saveFoodValidation={makeSaveFoodValidation()}
      saveFood={makeRemoteSaveFood()}
      loadFoodsByRestaurant={makeRemoteLoadFoodsByRestaurant(`${id}`)}
    />
  )
}
