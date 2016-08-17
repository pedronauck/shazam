import React from 'react';
import Perf from 'react-addons-perf';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';

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
  render(<Root />, rootEl);
}
