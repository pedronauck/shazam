const common = require('./common');

common.plugins.unshift(require.resolve('react-hot-loader/babel'));

module.exports = common;
