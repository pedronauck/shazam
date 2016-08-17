const path = require('path');
const postcss = require('./postcss');
const paths = require('./paths');

const appPackageJson = require(paths.app.packageJson);

module.exports = {
  entry: {
    vendor: Object.keys(appPackageJson.dependencies).filter(pkg => pkg !== '@drvem/shazam')
  },
  output: {
    path: paths.app.build,
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.css', ''],
    alias: {
      'babel-runtime/regenerator': require.resolve('babel-runtime/regenerator'),
      'config': `${paths.app.config}/dev.js`,
      'app': paths.app.src,
      'actions': `${paths.app.src}/actions`,
      'components': `${paths.app.src}/components`,
      'constants': `${paths.app.src}/constants`,
      'layouts': `${paths.app.src}/layouts`,
      'reducers': `${paths.app.src}/reducers`,
      'utils': `${paths.app.src}/utils`,
      'views': `${paths.app.src}/views`,
      'stylesheets': paths.app.stylesheets
    }
  },
  resolveLoader: {
    root: paths.nodeModules,
    moduleTemplates: ['*-loader']
  },
  module: {
    preLoaders: [{
      test: /\.js$/,
      loader: 'eslint',
      include: paths.app.src,
    }]
  },
  eslint: {
    configFile: path.join(__dirname, 'eslint.js'),
    useEslintrc: false
  },
  postcss
};
