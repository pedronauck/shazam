const common = require('./common');

common.plugins.push(
  require.resolve('babili'),
  require.resolve('babel-plugin-transform-react-constant-elements')
);

module.exports = common;
