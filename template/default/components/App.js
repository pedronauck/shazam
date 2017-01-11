import React from 'react';

import Header from './Header';
import Home from './Home';

const App = ({ children }) => (
  <div className="App">
    <Header />
    <Home />
  </div>
);

export default App;
