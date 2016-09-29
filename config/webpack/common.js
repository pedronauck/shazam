const _  = require('lodash');
const argv = require('yargs').argv;
const path = require('path');
const webpack = require('webpack');
const { Config } = require('webpack-config');
const { exit } = require('shelljs');
const VendorChunkPlugin = require('webpack-vendor-chunk-plugin');
const paths = require('../paths');
const env = require('../env');
const loadConfig = require('../../utils/loadConfig');

const isReactExternals = argv.reactAsExternals;
const vendor = Object.keys(require(paths.app.packageJson).dependencies || {});
const filteredVendors = vendor.filter(dep => dep !== 'react' || dep !== 'react-dom');
const externals = [{
  'react': 'window.React',
  'react-dom': 'window.ReactDOM'
}];

module.exports = new Config().merge({
  entry: {
    vendor: isReactExternals ? filteredVendors : vendor
  },
  output: {
    path: paths.app.build,
    publicPath: '/'
  },
  externals: isReactExternals ? externals : null,
  resolve: {
    extensions: ['.js', '.css', ''],
    alias: {
      'babel-runtime/regenerator': require.resolve('babel-runtime/regenerator')
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
      include: [paths.app.src],
      loader: 'babel',
      query: require(`../babel/${JSON.parse(env['process.env.NODE_ENV'])}`)
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
    new webpack.optimize.DedupePlugin(),
    new VendorChunkPlugin('vendor'),
    new webpack.DefinePlugin(env),
    new webpack.DefinePlugin({
      'CONFIG': JSON.stringify(loadConfig('envConfig'))
    })
  ],
  eslint: {
    configFile: path.join(__dirname, '../eslint.js'),
    useEslintrc: false
  },
  postcss(bundler) {
    const plugins = loadConfig('postcss', bundler);
    return _.isArray(plugins) ? plugins : exit(1);
  }
});
