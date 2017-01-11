import { createStore, applyMiddleware, compose } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux'
import thunkMiddleware from 'redux-thunk';
import rootReducer from 'ducks';
import { devToolsEnhancer } from './devtools';
import { loggerMiddleware } from './logger';

const IS_DEV = process.env.NODE_ENV === 'development';

export default function configureStore() {
  const middleware = applyMiddleware(
    routerMiddleware(browserHistory),
    thunkMiddleware,
    ...IS_DEV ? [loggerMiddleware] : []
  );

  const enhancer = compose(
    middleware,
    ...IS_DEV ? [devToolsEnhancer] : []
  );

  const store = createStore(rootReducer, enhancer);

  if (IS_DEV && module.hot) {
    module.hot.accept('../../ducks', () =>
      store.replaceReducer(require('../../ducks').default));
  }

  return store;
}
