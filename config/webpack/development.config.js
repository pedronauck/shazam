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
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.app.htmlFile,
      data: shazamConfig.htmlData.development || {}
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ]
});
