const common = require('./common');

common.plugins.push(
  require.resolve('babel-plugin-transform-react-constant-elements'),
  require.resolve('babel-plugin-transform-react-remove-prop-types'),
  require.resolve('babel-plugin-transform-react-pure-class-to-function')
);

module.exporst = common;
