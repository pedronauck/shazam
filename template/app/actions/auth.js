import { api } from 'config';
import { fetchResource } from 'utils/redux/fetchResource';

import {
  LOGIN_REQUEST,
  LOGIN_RESPONSE,
  REGISTER_REQUEST,
  REGISTER_RESPONSE,
  LOGOUT
} from '../constants/ActionTypes';

const loginRequest = () => ({
  type: LOGIN_REQUEST
});

const loginResponse = (payload) => ({
  type: LOGIN_RESPONSE,
  payload
});

const registerRequest = () => ({
  type: REGISTER_REQUEST
});

const registerResponse = (payload) => ({
  type: REGISTER_RESPONSE,
  payload
});

export const login = (user, password) => (dispatch) => {
  dispatch(loginRequest());

  return fetchResource(`${api.hostname}/accounts/auth`, { auth: { user, password } })
    .then(
      (account) => {
        dispatch(loginResponse({ account, user, password, isAuthenticated: true }));
      },
      (error) => dispatch(loginResponse({ error, isAuthenticated: false }))
    );
}

export const logout = () => ({
  type: LOGOUT
});

export const register = (body) => (dispatch) => {
  dispatch(registerRequest());

  return fetchResource(`${api.hostname}/users`, { body })
    .then(
      () => {
        dispatch(registerResponse({ isRegistering: false }));
        dispatch(login(body.email, body.password));
      },
      error => dispatch(registerResponse({ error, isRegistering: false }))
    );
}
