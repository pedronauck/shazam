import React, { PropTypes } from 'react';
import { Router, browserHistory } from 'react-router';

import routes from '../routes';

const Root = (history) => (
  <Router history={browserHistory} routes={routes} />
);

Root.PropTypes = {
  history: PropTypes.object
};

export default Root;
