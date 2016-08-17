/* eslint prefer-template: 0 */

const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('../utils/WatchMissingNodeModulesPlugin');
const common = require('./webpack.config.common.js');
const paths = require('./paths');
const env = require('./env');

const shazamConfig = require(paths.app.shazamConfig);

module.exports = _.merge(common, {
  devtool: 'cheap-module-source-map',
  entry: {
    main: [
      require.resolve('react-hot-loader/patch'),
      require.resolve('webpack-hot-middleware/client'),
      require.resolve('./polyfills'),
      path.join(paths.app.stylesheets, 'main'),
      path.join(paths.app.src, 'main')
    ]
  },
  output: {
    pathinfo: true,
    filename: 'static/js/[name].js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: paths.app.src,
      loader: 'babel',
      query: require('./babel.dev')
    }, {
      test: /\.css$/,
      include: [paths.app.stylesheets, paths.app.nodeModules],
      loader: 'style!css!postcss'
    }, {
      test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)(\?.*)?$/,
      include: [paths.app.images, paths.app.nodeModules],
      loader: 'file',
      query: {
        name: 'static/media/[name].[ext]'
      }
    }, {
      test: /\.(mp4|webm)(\?.*)?$/,
      include: [paths.app.media, paths.app.nodeModules],
      loader: 'url',
      query: {
        limit: 10000,
        name: 'static/media/[name].[ext]'
      }
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.app.htmlFile,
      data: shazamConfig.htmlData.development || {}
      // favicon: paths.appFavicon,
    }),
    new webpack.DefinePlugin(env),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ]
});
