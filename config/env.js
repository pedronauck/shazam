/* eslint no-param-reassign: 0 */

const SHAZAM = /^SHAZAM_/i;
const NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development');

export default Object
  .keys(process.env)
  .filter(key => SHAZAM.test(key))
  .reduce((env, key) => {
    env[`process.env.${key}`] = JSON.stringify(process.env[key]).replace('"', '');
    return env;
  }, {
    'process.env.NODE_ENV': NODE_ENV
  });
