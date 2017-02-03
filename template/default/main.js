import 'stylesheets/base';

import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';

import App from 'components/App';

const rootEl = document.getElementById('root');
const renderApp = (Comp = App) => {
  render((
    <AppContainer>
      <Comp />
    </AppContainer>
  ), rootEl);
};

if (module.hot) {
  module.hot.accept('./components/App', () =>
    renderApp(require('./components/App').default));
}

renderApp();
