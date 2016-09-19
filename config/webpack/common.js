const path = require('path');
const webpack = require('webpack');
const { Config } = require('webpack-config');
const postcss = require('../postcss');
const paths = require('../paths');
const env = require('../env');
const loadConfig = require('../../utils/loadConfig');

const dependencies = Object.keys(require(paths.app.packageJson).dependencies);
const NODE_ENV = JSON.parse(env['process.env.NODE_ENV']);
const drvemPackages = dependencies
  .filter(dep => !dep.search('@drvem'))
  .map(dep => path.join(paths.app.nodeModules, dep));

const defaultConfig = new Config().merge({
  entry: {
    vendor: Object.keys(require(paths.app.packageJson).dependencies)
  },
  output: {
    path: paths.app.build,
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.css', ''],
    alias: {
      'babel-runtime/regenerator': require.resolve('babel-runtime/regenerator'),
      'app': paths.app.src,
      'actions': `${paths.app.src}/actions`,
      'components': `${paths.app.src}/components`,
      'constants': `${paths.app.src}/constants`,
      'layouts': `${paths.app.src}/layouts`,
      'reducers': `${paths.app.src}/reducers`,
      'utils': `${paths.app.src}/utils`,
      'views': `${paths.app.src}/views`
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
    }],
    loaders: [{
      test: /\.js$/,
      include: [...drvemPackages, paths.app.src],
      loader: 'babel',
      query: require(`../babel/${NODE_ENV}`)
    }, {
      test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)(\?.*)?$/,
      include: [paths.app.images, paths.app.nodeModules],
      loader: 'file',
      query: {
        name: 'static/media/[name].[hash:8].[ext]'
      }
    }, {
      test: /\.(mp4|webm)(\?.*)?$/,
      include: [paths.app.media, paths.app.nodeModules],
      loader: 'url',
      query: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]'
      }
    }]
  },
  plugins: [
    new webpack.DefinePlugin(env),
    new webpack.DefinePlugin({
      'CONFIG': JSON.stringify(loadConfig('envConfig'))
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    })
  ],
  eslint: {
    configFile: path.join(__dirname, '../eslint.js'),
    useEslintrc: false
  },
  postcss
});

module.exports = defaultConfig.merge(loadConfig('webpackConfig'));
