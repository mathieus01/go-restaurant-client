import { FormStatus, Input } from '@/presentation/components'
import React from 'react'
import Styles from './save-food-styles.scss'

type Props = {
  onSubmit: React.FormEventHandler<HTMLFormElement>
  isFormInvalid: boolean
}

const SaveFood: React.FC<Props> = ({ onSubmit, isFormInvalid }: Props) => {
  const foodImage = 'https://static-images.ifood.com.br/image/upload/t_low/pratos/0db84528-bab8-4883-ba40-8fe6856ff1b1/202001262144_fGUN_b.jpg'
  return (
    <form className={Styles.restaurantNewFoodItem} onSubmit={onSubmit} data-testid="food-form">
      <h2 className={Styles.foodItemTitle}>Adicionar Item</h2>
      <div className={Styles.foodFields}>
        <img src={foodImage} alt="pizza"/>
        <div className={Styles.inputFoodFields}>
          <Input type="text" name="name" className={Styles.foodInput} placeholder="Digite o nome"/>
          <Input type="text" name="type" className={Styles.foodInput} placeholder="Digite a categoria"/>
          <Input type="text" name="price" className={Styles.foodInput} placeholder="Digite o preço"/>
          <Input type="text" name="description" className={[Styles.foodInput, Styles.foodTextArea].join(' ')} placeholder="Digite a descrição"/>
        </div>
      </div>
      <FormStatus />
      <div className={Styles.newFoodFooter}>
        <button className={Styles.secondaryButton}>Cancelar</button>
        <button className={Styles.primaryButton} disabled={isFormInvalid} data-testid="submit">Adicionar Item</button>
      </div>
    </form>
  )
}

export default SaveFood
