import React from 'react';
import { Route, IndexRoute } from 'react-router';

import AppLayout from 'layouts/App';
import NotFoundLayout from 'layouts/NotFound';

import Home from 'views/Home';

const routes = (
  <Route path="/" component={AppLayout}>
    <IndexRoute component={Home} />
    <Route path="*" component={NotFoundLayout} />
  </Route>
);

export default routes;
