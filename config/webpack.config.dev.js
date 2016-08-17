/* eslint prefer-template: 0 */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('../utils/WatchMissingNodeModulesPlugin');
const postcss = require('./postcss');
const paths = require('./paths');
const env = require('./env');

const appPackageJson = require(paths.app.packageJson);
const shazamConfig = require(paths.app.shazamConfig);

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: {
    main: [
      require.resolve('react-hot-loader/patch'),
      require.resolve('webpack-hot-middleware/client'),
      require.resolve('./polyfills'),
      path.join(paths.app.stylesheets, 'main'),
      path.join(paths.app.src, 'main')
    ],
    vendor: Object.keys(appPackageJson.dependencies).filter(pkg => pkg !== '@drvem/shazam')
  },
  output: {
    pathinfo: true,
    filename: 'static/js/[name].js',
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
    }],
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
  ],
  eslint: {
    configFile: path.join(__dirname, 'eslint.js'),
    useEslintrc: false
  },
  postcss
};
