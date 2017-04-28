import React, { PropTypes } from 'react'
import { Router } from 'react-router'

const Root = ({ routes, history }) => (
  <Router history={history} routes={routes()} />
)

Root.propTypes = {
  routes: PropTypes.object,
  history: PropTypes.object,
}

export default Root
