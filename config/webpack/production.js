const { argv } = require('yargs');
const { join, resolve } = require('path');
const { Config } = require('webpack-config');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const paths = require('../paths');
const loadConfig = require('../../utils/load-config');
const cssModulesLoader = require('../../utils/css-module-loaders');

const hasCSSModules = !argv.noCssModules;

const config = new Config().extend(resolve(__dirname, './common.js')).merge({
  bail: true,
  devtool: 'cheap-module-source-map',
  entry: {
    main: [
      require.resolve('babel-polyfill'),
      join(paths.app.src, 'main')
    ]
  },
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      include: [paths.app.stylesheets, paths.app.nodeModules],
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: 'css-loader?minimize-loader!postcss-loader'
      })
    }, ...hasCSSModules ? [{
      test: /\.css$/,
      include: [paths.app.src],
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: cssModulesLoader
      })
    }] : []]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.app.htmlFile,
      data: loadConfig('htmlData'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new ExtractTextPlugin('static/css/[name].[contenthash:8].css'),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      },
      output: {
        comments: false
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  ]
});

module.exports = config.merge(loadConfig('webpackConfig', config));
