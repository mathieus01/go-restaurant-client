import { UpdateOrderStatus } from '@/domain/usecases'
import { createContext } from 'react'

type Props = {
  updateOrderStatus?: UpdateOrderStatus
  handleError?: any
  reload?: () => void
}

export default createContext<Props>(null)
