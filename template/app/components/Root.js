import React, { PropTypes, Children } from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import routes from '../routes';

if (process.env.NODE_ENV === 'development') {
  Router.prototype.componentWillReceiveProps = (nextProps) => {
    const components = [];
    const grabComponents = (routesProp) => {
      Children.toArray(routesProp.props.children).forEach((route) => {
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

const Root = ({ store, history }) => (
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object,
  history: PropTypes.object
};

export default Root;
