export const AUTH_KEY = 'auth.key';

export const clearCredentials = () => {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (e) {
    return;
  }
};

export const loadCredentials = () => {
  try {
    const item = localStorage.getItem(AUTH_KEY);
    const parsed = item && JSON.parse(item);

    if (parsed && parsed.account) return parsed;
  } catch (e) {
    return {};
  }

  return {};
};

export const saveCredentials = (payload) => {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
  } catch (e) {
    return;
  }
};

export default {
  clear: clearCredentials,
  load: loadCredentials,
  save: saveCredentials
}
