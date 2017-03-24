const { merge } = require('lodash')

const loadConfig = require('../../utils/load-config')
const common = require('./common')

common.plugins.push(
  require.resolve('react-hot-loader/babel'),
  require.resolve('babel-plugin-transform-react-remove-prop-types'),
  require.resolve('babel-plugin-transform-react-pure-class-to-function'),
  require.resolve('babel-plugin-transform-react-jsx-source'),
  require.resolve('babel-plugin-transform-react-jsx-self')
)

module.exports = merge(common, loadConfig('babel'))
