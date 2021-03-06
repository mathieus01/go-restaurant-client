import React, { useState, useEffect, useContext } from 'react'
import Styles from './signup-styles.scss'
import { BackgroundImage, FormStatus, Input, RadioButton } from '@/presentation/components'
import { FormContext, ApiContext } from '@/presentation/contexts'
import { Validation } from '@/presentation/protocols'
import { AddAccount } from '@/domain/usecases'
import { useHistory } from 'react-router-dom'

type Props = {
  validation: Validation
  addAccount: AddAccount
}

const SignUp: React.FC<Props> = ({ validation, addAccount }: Props) => {
  const history = useHistory()
  const { setCurrentAccount } = useContext(ApiContext)
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    isRestaurant: null,
    nameError: '',
    emailError: '',
    passwordError: '',
    passwordConfirmationError: '',
    isRestaurantError: '',
    mainError: ''
  })
  useEffect(() => { validate('name') }, [state.name])
  useEffect(() => { validate('email') }, [state.email])
  useEffect(() => { validate('password') }, [state.password])
  useEffect(() => { validate('passwordConfirmation') }, [state.passwordConfirmation])
  useEffect(() => { validate('isRestaurant') }, [state.isRestaurant])

  const validate = (field: string): void => {
    const { name, email, password, passwordConfirmation, isRestaurant } = state
    const formData = { name, email, password, passwordConfirmation, isRestaurant }
    setState(old => ({ ...old, [`${field}Error`]: validation.validate(field, formData) }))
    setState(old => ({ ...old, isFormInvalid: !!old.nameError || !!old.emailError || !!old.passwordError || !!old.passwordConfirmationError || !!old.isRestaurantError }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    try {
      if (state.isFormInvalid || state.isLoading) {
        return
      }
      setState(old => ({ ...old, isLoading: true }))
      const account = await addAccount.add({
        name: state.name,
        email: state.email,
        password: state.password,
        passwordConfirmation: state.passwordConfirmation,
        isRestaurant: state.isRestaurant === 'true'
      })
      setCurrentAccount(account)
      history.replace('/')
    } catch (error) {
      setState(old => ({ ...old, isLoading: false, mainError: error.message }))
    }
  }

  return (
    <div className={Styles.signupWrap}>
      <BackgroundImage />
      <div className={Styles.formWrap}>
        <FormContext.Provider value={{ state, setState }}>
          <form data-testid="form" className={Styles.form} onSubmit={handleSubmit}>
            <h2>Criar Conta</h2>
            <Input type="text" name="name" placeholder="Digite seu nome"/>
            <Input type="email" name="email" placeholder="Digite seu email"/>
            <Input type="password" name="password" placeholder="Digite sua senha"/>
            <Input type="password" name="passwordConfirmation" placeholder="Repita sua senha"/>
            <div className={Styles.isRestaurant}>
              <RadioButton type="radio" name="isRestaurant" value="false" placeholder="Usuario" />
              <RadioButton type="radio" name="isRestaurant" value="true" placeholder="Restaurante" />
            </div>
            <button type="submit" data-testid="submit" disabled={state.isFormInvalid}>Cadastrar</button>
            <FormStatus />
          </form>
        </FormContext.Provider>
      </div>
    </div>
  )
}

export default SignUp
