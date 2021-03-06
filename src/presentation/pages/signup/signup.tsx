import React from 'react'
import Styles from './signup-styles.scss'
import { Validation } from '@/presentation/protocols'
import { AddAccount } from '@/domain/usecases'
import { BackgroundImage, FormStatus, Input, RadioButton } from '@/presentation/components'

type Props = {
  validation: Validation
  addAccount: AddAccount
}

const SignUp: React.FC<Props> = ({ validation, addAccount }: Props) => {
  return (
    <div className={Styles.signupWrap}>
      <BackgroundImage />
      <div className={Styles.formWrap}>
        <form className={Styles.form}>
          <h2>Criar Conta</h2>
          <Input type="text" name="name" placeholder="Digite seu nome"/>
          <Input type="email" name="email" placeholder="Digite seu email"/>
          <Input type="password" name="password" placeholder="Digite sua senha"/>
          <Input type="password" name="passwordConfirmation" placeholder="Repita sua senha"/>
          <div className={Styles.isRestaurant}>
            <RadioButton type="radio" name="isRestaurant" value="false" placeholder="Usuario" />
            <RadioButton type="radio" name="isRestaurant" value="true" placeholder="Restaurante" />
          </div>
          <button>Cadastrar</button>
          <FormStatus />
        </form>
      </div>
    </div>
  )
}

export default SignUp
