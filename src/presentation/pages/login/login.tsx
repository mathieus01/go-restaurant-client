import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { BackgroundImage, FormStatus, Input } from '@/presentation/components'
import { FormContext, ApiContext } from '@/presentation/contexts'
import Styles from './login-styles.scss'
import { Validation } from '@/presentation/protocols'
import { Authentication } from '@/domain/usecases'

type Props = {
  validation: Validation
  authentication: Authentication
}

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
  const { setCurrentAccount } = useContext(ApiContext)
  const history = useHistory()
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: ''
  })
  useEffect(() => { validate('email') }, [state.email])
  useEffect(() => { validate('password') }, [state.password])

  const validate = (field: string): void => {
    const { email, password } = state
    const formData = { email, password }
    setState(old => ({ ...old, [`${field}Error`]: validation.validate(field, formData) }))
    setState(old => ({ ...old, isFormInvalid: !!old.emailError || !!old.passwordError }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    try {
      if (state.isLoading || state.isFormInvalid) {
        return
      }
      setState(old => ({ ...old, isLoading: true }))
      const account = await authentication.auth({
        email: state.email,
        password: state.password
      })
      setCurrentAccount(account)
      history.replace('/')
    } catch (error) {
      setState(old => ({ ...old, isLoading: false, mainError: error.message }))
    }
  }

  return (
    <div className={Styles.loginWrap}>
      <BackgroundImage />
      <div className={Styles.formWrap}>
        <FormContext.Provider value={{ state, setState }}>
          <form data-testid="form" className={Styles.form} onSubmit={handleSubmit}>
            <h2>Login</h2>
            <Input type="email" name="email" placeholder="Digite seu email"/>
            <Input type="password" name="password" placeholder="Digite sua senha"/>
            <button type="submit" data-testid="submit" disabled={state.isFormInvalid}>Entrar</button>
            <Link to='/signup' data-testid="signup-link" className={Styles.link}>Criar Conta</Link>
            <FormStatus />
          </form>
        </FormContext.Provider>
      </div>
    </div>
  )
}

export default Login
