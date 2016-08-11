import 'stylesheets/main';

import React from 'react';
import Perf from 'react-addons-perf';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { browserHistory } from 'react-router';

import Root from './components/Root';

const rootEl = document.getElementById('root');

const renderApp = (RootComponent) => {
  render(
    <AppContainer>
      <RootComponent />
    </AppContainer>,
    rootEl
  );
};

if (process.env.NODE_ENV === 'dev') {
  window.Perf = Perf;
  renderApp(Root);
}

if (process.env.NODE_ENV === 'dev' && module.hot) {
  module.hot.accept('./components/Root', () => {
    renderApp(require('./components/Root').default);
  });
}

if (process.env.NODE_ENV === 'production') {
  render(<Root />, rootEl);
}
