import env from '../config/env';
import paths from '../config/paths';

let shazamConfig;

try {
  shazamConfig = require(paths.app.shazamConfig);
}
catch(e) {
  shazamConfig = {};
}

const loadConfig = (method) => {
  const conf = shazamConfig[method];
  const envName = JSON.parse(env['process.env.NODE_ENV']);

  if (conf && typeof conf === 'function') {
    return conf(envName);
  }

  return {};
};

export default loadConfig;
