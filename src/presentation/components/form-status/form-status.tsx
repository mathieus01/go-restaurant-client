import React from 'react'
import { Spinner } from '@/presentation/components'
import Styles from './form-status-styles.scss'

const FormStatus: React.FC = () => {
  return (
    <div className={Styles.errorWrap}>
      <Spinner />
      <span data-testid="main-error" className={Styles.error}>Lorem ipsum dolor sit amet.</span>
    </div>
  )
}

export default FormStatus
