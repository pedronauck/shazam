/* eslint import/no-extraneous-dependencies: 0 */

import { createStore, applyMiddleware, compose } from 'redux'
import { browserHistory } from 'react-router'
import { routerMiddleware } from 'react-router-redux'

import rootReducer from 'ducks'
import devTools from './dev-tools'

const IS_DEV = (process.env.NODE_ENV === 'development')

export default function configureStore() {
  const middleware = applyMiddleware(
    routerMiddleware(browserHistory)
  )

  const enhancer = compose(middleware, devTools())
  const store = createStore(rootReducer, enhancer)

  if (IS_DEV && module.hot) {
    module.hot.accept('../../ducks', () =>
      store.replaceReducer(require('../../ducks').default))
  }

  return store
}
