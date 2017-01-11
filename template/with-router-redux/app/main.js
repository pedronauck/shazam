import 'stylesheets/base';

import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from 'utils/redux/configure-store';
import routes from './routes';
import Root from './components/Root';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);
const rootProps = { store, history, routes };

const rootEl = document.getElementById('root');

if (module.hot) {
  module.hot.accept('./components/Root', () => {
    const RootComp = require('./components/Root').default;
    render(<RootComp {...rootProps} />, rootEl);
  });
}

render(<Root {...rootProps} />, rootEl);
