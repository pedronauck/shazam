import React from 'react';
import Perf from 'react-addons-perf';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from 'utils/redux/configureStore';
import Root from './components/Root';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);
const rootProps = { store, history };

const rootEl = document.getElementById('root');
const renderApp = (RootComponent) => {
  render(
    <AppContainer>
      <RootComponent {...rootProps} />
    </AppContainer>,
    rootEl
  );
};

if (process.env.NODE_ENV === 'development') {
  window.Perf = Perf;
  renderApp(Root);
}

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./components/Root', () => {
    renderApp(require('./components/Root').default);
  });
}

if (process.env.NODE_ENV === 'production') {
  render(<Root {...rootProps} />, rootEl);
}
