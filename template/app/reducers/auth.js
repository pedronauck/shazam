import { filterActions } from 'redux-ignore';
import { credentials } from 'utils/auth';

import {
  LOGIN_RESPONSE,
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  REGISTER_RESPONSE,
  LOGOUT
} from 'constants/ActionTypes';

const reducer = (state = credentials.load(), { type, payload }) => {
  switch (type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, { isAuthenticating: true });

    case LOGIN_RESPONSE:
      if (payload.isAuthenticated) {
        credentials.save(payload);
      } else if (payload.error === 401 || payload.error === 403) {
        Object.assign(payload, { errorMessage: 'Usuário ou senha incorretos' });
      }

      return Object.assign({}, payload, { isAuthenticating: false });

    case REGISTER_REQUEST:
      return Object.assign({}, state, { isRegistering: true });

    case REGISTER_RESPONSE:
      if (payload.error === 409) {
        Object.assign(payload, { errorMessage: 'Este email já está sendo usado' });
      } else if (payload.error === 400) {
        Object.assign(payload, { errorMessage: 'Algo deu errado, tente novamente' });
      }

      return Object.assign({}, payload, { isRegistering: false });

    case LOGOUT:
      credentials.clear();
      return { isAuthenticated: false };

    default:
      return state;
  }
};

export default filterActions(
  reducer,
  ({ type }) => /@@|^LOGIN|^REGISTER|^LOGOUT/g.test(type)
);
