const merge = require('deepmerge')

const loadConfig = require('../../utils/load-config')
const common = require('./common')

common.plugins.push(
  require.resolve('babel-plugin-transform-react-constant-elements')
)

module.exports = merge(common, loadConfig('babel'))
