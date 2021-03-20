import React, { useContext, useState, useEffect } from 'react'
import { FiPlusCircle, FiMinusCircle } from 'react-icons/fi'
import { FoodModel } from '@/domain/models'
import { CartContext } from '@/presentation/contexts'
import Styles from './cart-styles.scss'
import { AddOrder } from '@/domain/usecases'

const Cart: React.FC = () => {
  const [state, setState] = useState({
    subTotal: 0,
    fee: 6.99,
    total: 0
  })
  const { cart, setCart } = useContext(CartContext)

  const removeFood = (food: FoodModel): void => {
    const foods = cart.foods.filter(foodCart => foodCart.id !== food.id)
    setCart(old => ({ ...old, foods: [...foods] }))
  }

  const increaseAmount = (food: FoodModel): void => {
    const newFood = cart.foods.find(foodCart => foodCart.id === food.id)
    newFood.amount += 1
    const foods = cart.foods.filter(foodCart => foodCart.id !== food.id)
    setCart(old => ({ ...old, foods: [...foods, newFood] }))
  }

  const decreaseAmount = (food: FoodModel): void => {
    const newFood = cart.foods.find(foodCart => foodCart.id === food.id)
    newFood.amount -= 1
    if (newFood.amount > 0) {
      const foods = cart.foods.filter(foodCart => foodCart.id !== food.id)
      setCart(old => ({ ...old, foods: [...foods, newFood] }))
    } else {
      removeFood(food)
    }
  }

  const getSubTotal = (): void => {
    let subTotal = 0
    cart.foods.forEach(food => {
      subTotal += food.amount * food.price
    })
    setState(old => ({ ...old, subTotal, total: subTotal + old.fee }))
  }

  const checkout = (): void => {
    const foodsOrder = cart.foods.map(food => ({
      food_id: food.id,
      amount: food.amount,
      observation: 'any_observation'
    }))
    const addOrderParams = {
      date: new Date(),
      address: 'any_address',
      status: 'CRIADA',
      foodsOrder
    }

    console.log(addOrderParams)
  }

  useEffect(() => {
    getSubTotal()
  }, [cart.foods])

  return (
    <div className={Styles.cartWrap}>
      {cart.foods && cart.foods.length
        ? <>
          <section className={Styles.cartTitle} data-testid="cartTitle">
            <span>Seu pedido em</span>
            <h2>Pizza Cesar - Aguas Claras</h2>
          </section>
          {cart.foods.map((food) => (
            <section className={Styles.cartOrder} data-testid="cartOrder" key={food.id}>
              <div>
                <span data-testid="food-name">{`${food.amount}x ${food.name}`}</span>
                <strong data-testid="food-price">R$ {food.amount * food.price}</strong>
              </div>
              <div className={Styles.foodButtons}>
                <div>
                  <button type="button" data-testid="increaseButton" className={Styles.increaseButton} onClick={e => increaseAmount(food)}><FiPlusCircle size={18} /></button>
                  <button type="button" data-testid="decreaseButton" className={Styles.decreaseButton} onClick={e => decreaseAmount(food)}><FiMinusCircle size={18} /></button>
                </div>
                <button type="button" data-testid="removeButton" className={Styles.removeButton} onClick={e => removeFood(food)}>Remover</button>
              </div>
            </section>
          ))}
          <section className={Styles.cartPrice}>
            <div className={Styles.subTotal}>
              <span>Subtotal</span>
              <span data-testid="subtotal">R$ {state.subTotal}</span>
            </div>
            <div className={Styles.deliveryFee}>
              <span>Taxa de entrega</span>
              <span>R$ {state.fee}</span>
            </div>
            <div className={Styles.total}>
              <strong>Total</strong>
              <span data-testid="total">R$ {state.total}</span>
            </div>
          </section>
          <button onClick={e => checkout()}>Finalizar</button>
        </>
        : <div className={Styles.cartEmpty} data-testid="cartEmpty">
          <h2>Sua sacola está vazia</h2>
          <span>Adicione itens</span>
        </div>
      }
    </div>
  )
}

export default Cart
