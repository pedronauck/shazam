import React from 'react';
import { connect } from 'react-redux';

import { changeName } from 'ducks/superhero';
import styles from './Home.css';

const Home = ({ superhero, changeName }) => (
  <div>
    <h2 className={styles.title}>Welcome {superhero}</h2>
    <p className={styles.subtitle}>
      Change the input value to see the power of Shaaaazam!
    </p>
    <div className={styles.inputWrapper}>
      <input onChange={(ev) => changeName(ev.target.value)} value={superhero} />
    </div>
  </div>
);

const mapStateToProps = ({ superhero }) => ({ superhero });

export default connect(mapStateToProps, { changeName })(Home);
