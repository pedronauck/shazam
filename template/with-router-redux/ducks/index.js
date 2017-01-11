import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import superhero from './superhero';

const rootReducer = combineReducers({
  routing: routerReducer,
  superhero
});

export default rootReducer;
