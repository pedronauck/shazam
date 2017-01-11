import { App, NotFound } from 'components/layouts';
import Home from 'modules/Home';

const appRoutes = {
  component: App,
  childRoutes: [
    Home
  ]
};

const notFoundRoutes = {
  path: '*',
  component: NotFound
};

export default {
  childRoutes: [
    appRoutes,
    notFoundRoutes
  ]
};
