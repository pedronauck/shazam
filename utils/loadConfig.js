const env = require('../config/env');
const paths = require('../config/paths');

let shazamConfig;

try {
  shazamConfig = require(paths.app.shazamConfig);
}
catch(e) {
  shazamConfig = {};
}

module.exports = (method) => {
  const conf = shazamConfig[method];
  const envName = JSON.parse(env['process.env.NODE_ENV']);

  if (conf && typeof conf === 'function') {
    return conf(envName);
  }

  return {};
};
