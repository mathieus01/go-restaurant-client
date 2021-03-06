import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { BackgroundImage, FormStatus, Input } from '@/presentation/components'
import { FormContext } from '@/presentation/contexts'
import Styles from './login-styles.scss'

const Login: React.FC = () => {
  const [state, setState] = useState({
    isLoading: false,
    isFormInvalid: true,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: ''
  })
  return (
    <div className={Styles.loginWrap}>
      <BackgroundImage />
      <div className={Styles.formWrap}>
        <FormContext.Provider value={{ state, setState }}>
          <form className={Styles.form}>
            <h2>Login</h2>
            <Input type="email" name="email" placeholder="Digite seu email"/>
            <Input type="password" name="password" placeholder="Digite sua senha"/>
            <button type="submit">Entrar</button>
            <Link to='/signup' className={Styles.link}>Criar Conta</Link>
            <FormStatus />
          </form>
        </FormContext.Provider>
      </div>
    </div>
  )
}

export default Login
