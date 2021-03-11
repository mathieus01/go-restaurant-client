import { FoodList } from '@/presentation/pages'
import React from 'react'
import { useParams } from 'react-router-dom'
import { makeRemoteLoadFoodsByRestaurant } from '@/main/factories/usecases'

export const makeFoodList: React.FC = () => {
  type Props = {
    id: string
  }

  const { id } = useParams<Props>()
  return (
    <FoodList
      loadFoodsByRestaurant={makeRemoteLoadFoodsByRestaurant(id)}
    />
  )
}
