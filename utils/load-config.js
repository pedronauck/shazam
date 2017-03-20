const { red } = require('chalk')

const env = require('../config/env')
const paths = require('../config/paths')

let shazamConfig

try {
  shazamConfig = require(paths.app.shazamConfig)
} catch (err) {
  console.log(red(err))
  shazamConfig = {}
}

module.exports = (method, ...rest) => {
  const conf = shazamConfig[method]
  const envName = JSON.parse(env['process.env.NODE_ENV'])
  const params = rest.length ? [envName, ...rest] : [envName]

  if (conf && typeof conf === 'function') {
    return conf(...params)
  }

  return {}
}
