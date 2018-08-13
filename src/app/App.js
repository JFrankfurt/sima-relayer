import {Provider} from 'mobx-react'
import React from 'react'
import {hot} from 'react-hot-loader'
import {HashRouter as Router, Redirect, Route, Switch} from 'react-router-dom'
import {Home} from './screens/Home'
import {Store} from './store/index'

window.store = new Store()

const App = () =>
  <Router>
    <Provider store={window.store}>
      <div>
        <Switch>
          <Route path='/index' component={Home}/>
          <Route path='/' component={<Redirect to='/index'/>}/>
        </Switch>
      </div>
    </Provider>
  </Router>

export const Root = hot(module)(() => <App/>)
