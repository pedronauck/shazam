import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from 'utils/redux/configureStore';
import routes from '../routes';

if (process.env.NODE_ENV === 'dev') {
  Router.prototype.componentWillReceiveProps = (nextProps) => {
    const components = [];
    const grabComponents = (routesProp) => {
      routesProp.props.children.forEach((route) => {
        if (route.component) {
          components.push(route.component)
        }
        if (route.indexRoute && route.indexRoute.component) {
          components.push(route.indexRoute.component)
        }
        if (route.childRoutes) {
          grabComponents(route.childRoutes)
        }
      });
    };

    grabComponents(nextProps.routes);
    components.forEach(React.createElement);
  }
}


const Root = () => {
  const store = configureStore();
  const history = syncHistoryWithStore(browserHistory, store);

  return (
    <Provider store={store}>
      <Router history={history} routes={routes} />
    </Provider>
  );
}

Root.PropTypes = {
  store: PropTypes.object,
  history: PropTypes.object
};

export default Root;
