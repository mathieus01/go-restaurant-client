import React from 'react'
import Styles from './signup-styles.scss'
import backImg from '../../assets/fundo.jpg'
import { Validation } from '@/presentation/protocols'
import { AddAccount } from '@/domain/usecases'
import { Spinner } from '@/presentation/components'

type Props = {
  validation: Validation
  addAccount: AddAccount
}

const SignUp: React.FC<Props> = ({ validation, addAccount }: Props) => {
  return (
    <div className={Styles.signupWrap}>
      <div className={Styles.logo}>
        <img src={backImg} alt="fundo"/>
      </div>
      <div className={Styles.formWrap}>
        <form className={Styles.form}>
          <h2>Criar Conta</h2>
          <input type="text" name="name" placeholder="Digite seu nome"/>
          <input type="email" name="email" placeholder="Digite seu email"/>
          <input type="password" name="password" placeholder="Digite sua senha"/>
          <input type="password" name="passwordConfirmation" placeholder="Repita sua senha"/>
          <div className={Styles.isRestaurant}>
            <div>
              <input type="radio" name="isRestaurant" value="false"/> Usuario
            </div>
            <div>
              <input type="radio" name="isRestaurant" value="true"/> Restaurante
            </div>
          </div>
          <button>Cadastrar</button>
          <div className={Styles.errorWrap}>
            <Spinner />
            <span data-testid="main-error" className={Styles.error}>Lorem ipsum dolor sit amet.</span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp
