import React from 'react'
import { useParams } from 'react-router-dom'
import { makeRemoteLoadOrderById } from '@/main/factories/usecases'
import { DetailOrder } from '@/presentation/pages'

export const makeDetailOrder: React.FC = () => {
  type Props = {
    id: string
  }

  const { id } = useParams<Props>()
  return (
    <DetailOrder loadOrderById={makeRemoteLoadOrderById(id)} />
  )
}
