import React from 'react'
import { makeSignUp, makeLogin, makeRestaurantList, makeFoodList } from '@/main/factories/pages'
import { setCurrentAccountAdapter, getCurrentAccountAdapter } from '@/main/adapters'
import { ApiContext } from '@/presentation/contexts'
import { PrivateRoute } from '@/presentation/components'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

const Router: React.FC = () => {
  return (
    <ApiContext.Provider
      value={{
        setCurrentAccount: setCurrentAccountAdapter,
        getCurrentAccount: getCurrentAccountAdapter
      }}>
      <BrowserRouter>
        <Switch>
          <Route path="/signup" exact component={makeSignUp} />
          <Route path="/login" exact component={makeLogin} />
          <PrivateRoute path="/" exact component={makeRestaurantList} />
          <PrivateRoute path="/restaurants/:id" component={makeFoodList} />
        </Switch>
      </BrowserRouter>
    </ApiContext.Provider>
  )
}

export default Router
