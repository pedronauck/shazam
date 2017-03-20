import React, { PropTypes as t } from 'react'

import Header from './components/Header'
import styles from './styles.css'

const App = ({ children }) => (
  <div className={styles.app}>
    <Header />
    {children}
  </div>
)

App.propTypes = {
  children: t.any
}

export default App
