const { join, resolve } = require('path');
const { Config } = require('webpack-config');
const argv = require('yargs').argv;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('../../utils/WatchMissingNodeModulesPlugin');
const paths = require('../paths');
const loadConfig = require('../../utils/loadConfig');

const DEFAULT_PORT = argv.port || 3000;

module.exports = new Config().extend(resolve(__dirname, './common.config.js')).merge({
  devtool: 'cheap-module-source-map',
  entry: {
    main: [
      require.resolve('babel-polyfill'),
      require.resolve('react-hot-loader/patch'),
      require.resolve('webpack-dev-server/client') + `http://localhost:${DEFAULT_PORT}`,
      require.resolve('webpack/hot/only-dev-server'),
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
      query: require('../babel/development')
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
      data: loadConfig('htmlData')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ]
});
