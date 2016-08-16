import fetch from 'isomorphic-fetch';
import { camelizeKeys } from 'humps'

const dateRegex = /^\d{4}-\d{2}-\d{2}$/

const camelizeKeysExceptDates = (obj) =>
  camelizeKeys(obj, (key, convert) =>
    dateRegex.test(key) ? key : convert(key));

const camelized = (resp) => resp.json()
  .then(camelizeKeysExceptDates)
  .catch(() => Promise.resolve());

const rejectOnError = (resp) =>
  !resp.ok ? Promise.reject(resp.status) : resp;

export default function(hostname, opts = {}) {
  return fetch(hostname, opts)
    .then(rejectOnError, Promise.reject)
    .then(camelized);
}
