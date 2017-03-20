const path = require('path')

const resolveOwn = relativePath => path.resolve(__dirname, relativePath)
const resolveApp = relativePath => path.resolve(relativePath)

const nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .filter(folder => !path.isAbsolute(folder))
  .map(resolveApp)

module.exports = {
  app: {
    src: resolveApp('app'),
    assets: resolveApp('assets'),
    stylesheets: resolveApp('assets/stylesheets'),
    images: resolveApp('assets/images'),
    media: resolveApp('assets/media'),
    config: resolveApp('config'),
    build: resolveApp('build'),
    packageJson: resolveApp('package.json'),
    nodeModules: resolveApp('node_modules'),
    htmlFile: resolveApp('assets/index.html'),
    mainJSFile: resolveApp('app/main.js'),
    shazamConfig: resolveApp('shazam.config.js')
  },
  config: resolveOwn('../config'),
  nodeModules: resolveOwn('../node_modules'),
  nodePaths
}
