import React, { PropTypes } from 'react';
import { Router } from 'react-router';

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

const Root = () => (
  <Router routes={routes} />
);

export default Root;
