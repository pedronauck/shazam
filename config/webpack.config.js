const { resolve } = require('path');
const { Config, environment } = require('webpack-config');
const env = require('./env');

environment.setAll({
  env: () => JSON.parse(env['process.env.NODE_ENV'])
});

module.exports = new Config().extend(resolve(__dirname, './webpack/[env].config.js'));
