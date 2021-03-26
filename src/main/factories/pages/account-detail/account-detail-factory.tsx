import React from 'react'
import { makeRemoteLoadFoodsByRestaurant } from '@/main/factories/usecases'
import { AccountDetail } from '@/presentation/pages'
import { getCurrentAccountAdapter } from '@/main/adapters'

export const makeAccountDetail: React.FC = () => {
  const { id } = getCurrentAccountAdapter()
  return (
    <AccountDetail
      loadFoodsByRestaurant={makeRemoteLoadFoodsByRestaurant(`${id}`)}
    />
  )
}
