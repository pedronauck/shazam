const path = require('path');

const resolveOwn = (relativePath) => path.resolve(__dirname, relativePath);
const resolveApp = (relativePath) => path.resolve(relativePath);

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
    htmlFile: resolveApp('assets/index.ejs')
  },
  config: resolveOwn('../config'),
  nodeModules: resolveOwn('../node_modules')
};
