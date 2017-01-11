const { join, resolve } = require('path');
const { Config } = require('webpack-config');
const { argv } = require('yargs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');

const paths = require('../paths');
const loadConfig = require('../../utils/load-config');
const cssModulesLoader = require('../../utils/css-module-loaders');

const hasCSSModules = !argv.noCssModules;
const vendor = Object.keys(require(paths.app.packageJson).dependencies || {});

const config = new Config().extend(resolve(__dirname, './common.js')).merge({
  devtool: 'cheap-module-source-map',
  entry: {
    vendor,
    main: [
      require.resolve('babel-polyfill'),
      require.resolve('react-dev-utils/webpackHotDevClient'),
      join(paths.app.src, 'main')
    ]
  },
  output: {
    pathinfo: true,
    filename: 'static/js/[name].js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      include: [paths.app.stylesheets],
      loader: 'style-loader!css-loader!postcss-loader'
    }, ...hasCSSModules ? [{
      test: /\.css$/,
      include: [paths.app.src],
      use: [{
        loader: 'style-loader',
        options: {
          sourceMap: true
        }
      }].concat(cssModulesLoader)
    }] : []]
  },
  performance: {
    hints: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.app.htmlFile
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'static/js/vendor.js',
      minChunks: Infinity
    }),
    new webpack.HotModuleReplacementPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModule),
    new CaseSensitivePathsPlugin()
  ]
});

module.exports = config.merge(loadConfig('webpackConfig', config));
