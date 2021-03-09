import React from 'react'
import { makeRemoteLoadRestaurants } from '@/main/factories/usecases'
import { RestaurantList } from '@/presentation/pages'

export const makeRestaurantList: React.FC = () => {
  return (
    <RestaurantList
      loadRestaurants={makeRemoteLoadRestaurants()}
    />
  )
}
