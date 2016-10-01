const common = require('./common');
const argv = require('yargs').argv;

const hasHotLoader = argv.hotLoader;

if (hasHotLoader) {
  common.plugins.unshift(require.resolve('react-hot-loader/babel'));
}

common.plugins.push(
  require.resolve('babel-plugin-transform-react-remove-prop-types'),
  require.resolve('babel-plugin-transform-react-pure-class-to-function')
);

module.exports = common;
