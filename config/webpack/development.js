const { join, resolve } = require('path');
const { Config } = require('webpack-config');
const { argv } = require('yargs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('../../utils/WatchMissingNodeModulesPlugin');
const paths = require('../paths');
const loadConfig = require('../../utils/loadConfig');

const DEFAULT_PORT = argv.port || 3000;
const hasHotLoader = argv.hotLoader;
const hasCSSModules = argv.cssModules;

const config = new Config().extend(resolve(__dirname, './common.js')).merge({
  devtool: 'cheap-module-source-map',
  entry: {
    main: [
      require.resolve('babel-polyfill'),
      ...hasHotLoader ? [require.resolve('react-hot-loader/patch')] : [],
      require.resolve('webpack-dev-server/client') + `?http://localhost:${DEFAULT_PORT}`,
      require.resolve('webpack/hot/only-dev-server'),
      join(paths.app.src, 'main')
    ]
  },
  output: {
    pathinfo: true,
    filename: 'static/js/[name].js'
  },
  module: {
    loaders: [{
      test: /\.css$/,
      include: [paths.app.stylesheets, paths.app.nodeModules],
      loader: 'style!css!postcss'
    }, ...hasCSSModules ? [{
      test: /\.css$/,
      include: [paths.app.src],
      loaders: [
        'style?sourceMap',
        'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        'postcss'
      ]
    }] : []]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.app.htmlFile,
      data: loadConfig('htmlData')
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'static/js/vendor.js', Infinity),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ]
});

module.exports = config.merge(loadConfig('webpackConfig', config));
