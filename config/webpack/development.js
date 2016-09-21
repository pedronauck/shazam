const { join, resolve } = require('path');
const { Config } = require('webpack-config');
const argv = require('yargs').argv;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('../../utils/WatchMissingNodeModulesPlugin');
const VendorChunkPlugin = require('webpack-vendor-chunk-plugin');
const paths = require('../paths');
const loadConfig = require('../../utils/loadConfig');

const { CommonsChunkPlugin } = webpack.optimize;
const DEFAULT_PORT = argv.port || 3000;

const config = new Config().extend(resolve(__dirname, './common.js')).merge({
  devtool: 'cheap-module-source-map',
  entry: {
    main: [
      require.resolve('babel-polyfill'),
      require.resolve('react-hot-loader/patch'),
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
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.app.htmlFile,
      data: loadConfig('htmlData')
    }),
    new CommonsChunkPlugin('vendor', 'static/js/vendor.js', Infinity),
    new VendorChunkPlugin('vendor'),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules)
  ]
});

module.exports = config.merge(loadConfig('webpackConfig', config));
