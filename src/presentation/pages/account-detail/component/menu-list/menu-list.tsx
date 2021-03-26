import { LoadFoodsByRestaurant } from '@/domain/usecases'
import React from 'react'
import { MenuItem } from '..'
import Styles from './menu-list-styles.scss'

type Props = {
  foods: LoadFoodsByRestaurant.Model[]
}

const MenuList: React.FC<Props> = ({ foods }: Props) => {
  return (
    <>
      {
        (!foods || foods.length === 0) ? (
          <div className={Styles.empty}>
            <h3>Nenhum item encontrado</h3>
          </div>
        ) : (
          <ul className={Styles.restaurantFoodList} data-testid="foods-list">
            {foods && foods.map(food => (
              <MenuItem food={food} key={food.id} />
            ))}
          </ul>
        )
      }
    </>
  )
}

export default MenuList
