import React from 'react'
import styles from './styles.css'

const Header = () => (
  <header>
    <h1 className={styles.logo}>
      <img src={require('images/shazam.svg')} width={400} alt="Shazam" />
    </h1>
  </header>
)

export default Header
