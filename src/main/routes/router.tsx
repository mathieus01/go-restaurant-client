import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-Router-dom'
import { makeSignUp, makeLogin } from '@/main/factories/pages'
import { ApiContext } from '@/presentation/contexts'
import { setCurrentAccountAdapter } from '../adapters'

const Router: React.FC = () => {
  return (
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountAdapter
      }}>
      <BrowserRouter>
        <Switch>
          <Route path="/signup" exact component={makeSignUp} />
          <Route path="/login" exact component={makeLogin} />
        </Switch>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}

export default Router
