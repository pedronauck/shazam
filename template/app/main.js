import 'stylesheets/main';

import React from 'react';
import Perf from 'react-addons-perf';
import { render } from 'react-dom';
import Root from './components/Root';

const rootEl = document.getElementById('root');
const renderApp = (RootComponent) => {
  render(
    <RootComponent />,
    rootEl
  );
};

if (process.env.NODE_ENV === 'development') {
  window.Perf = Perf;
  renderApp(Root);
}

if (process.env.NODE_ENV === 'production') {
  render(<Root />, rootEl);
}
