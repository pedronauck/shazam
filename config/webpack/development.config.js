import { join, resolve } from 'path';
import Config from 'webpack-config';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import WatchMissingNodeModulesPlugin from '../../utils/WatchMissingNodeModulesPlugin';
import paths from '../paths';
import babelQuery from '../babel.dev';

const shazamConfig = require(paths.app.shazamConfig);

export default new Config().extend(resolve(__dirname, './base.config.js')).merge({
  devtool: 'cheap-module-source-map',
  entry: {
    main: [
      require.resolve('react-hot-loader/patch'),
      require.resolve('webpack-hot-middleware/client'),
      require.resolve('../polyfills'),
      join(paths.app.stylesheets, 'main'),
      join(paths.app.src, 'main')
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
      query: babelQuery
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
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ]
});
