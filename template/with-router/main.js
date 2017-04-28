/* eslint import/no-extraneous-dependencies: 0 */

import 'stylesheets/base'

import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { browserHistory } from 'react-router'

import routes from './routes'
import Root from './components/Root'

const rootProps = { history: browserHistory }

const rootEl = document.getElementById('root')
const renderApp = (RootComponent = Root, routesProp = routes) =>
  render((
    <AppContainer key={Math.random()}>
      <RootComponent {...rootProps} routes={routesProp} />
    </AppContainer>
  ), rootEl)

// we need that to hot reload works with router
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./routes', () => {
    const nextRoutes = require('./routes').default
    const NextRoot = require('./components/Root').default

    renderApp(NextRoot, nextRoutes)
  })
}

renderApp()
