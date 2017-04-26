import React, { PropTypes } from 'react'
import { Router } from 'react-router'

const Root = ({ routes }) => (
  <Router routes={routes()} />
)

Root.propTypes = {
  routes: PropTypes.object
}

export default Root
