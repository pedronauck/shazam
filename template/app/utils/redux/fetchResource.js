import { decamelizeKeys } from 'humps'
import { credentials } from 'utils/auth';
import { fetch as fetchUtils } from 'utils';

const generateBasicAuth = ({ user, password }) =>
  `Basic ${btoa(`${user}:${password}`)}`;

const decamelized = (obj) =>
  JSON.stringify(decamelizeKeys(obj));

const sanitizeOptions = (opts) => {
  const { method, body } = opts;
  const auth = opts.auth || credentials.load();

  const bodyOptions = body ? { body: decamelized(body), method: 'post' } : {}
  const fetchOptions = method ? { method } : {}
  const authOptions = auth.user && auth.password ? {
    headers: { authorization: generateBasicAuth(auth) }
  } : {};

  return Object.assign({}, fetchOptions, bodyOptions, authOptions);
};

export const fetchResource = (hostname, opts = {}) =>
  fetchUtils(hostname, sanitizeOptions(opts));
