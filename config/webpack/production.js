/* eslint camelcase: 0, new-cap: 0 */
const { join, resolve } = require('path')
const { argv } = require('yargs')
const { Config } = require('webpack-config')
const webpack = require('webpack')
const StatsPlugin = require('stats-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')
const BabiliPlugin = require('babili-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')

const paths = require('../paths')
const loadConfig = require('../../utils/load-config')
const cssModulesLoader = require('../../utils/css-module-loaders')

const CSS_MODULES = !argv.noCssModules

const chooseMinifySystem = () => {
  switch (argv.minify) {
    case 'uglify':
      return new UglifyJSPlugin({
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
          join_vars: true
        },
        comments: false
      })
    default:
      return new BabiliPlugin()
  }
}

const config = new Config().extend(resolve(__dirname, './common.js')).merge({
  devtool: argv.sourceMap,
  entry: {
    main: [
      require.resolve('babel-polyfill'),
      join(paths.app.src, 'main')
    ]
  },
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    sourceMapFilename: 'static/js/[name].[chunkhash:8].js.map'
  },
  module: {
    rules: [{
      test: /\.css$/,
      include: [paths.app.stylesheets, paths.app.nodeModules],
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            minimize: true
          }
        }, {
          loader: 'postcss-loader',
          options: {
            plugins(bundler) {
              return loadConfig('postcss', bundler) || []
            }
          }
        }]
      })
    }, ...CSS_MODULES ? [{
      test: /\.css$/,
      include: [paths.app.src],
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: cssModulesLoader
      })
    }] : []]
  },
  plugins: [
    new SimpleProgressWebpackPlugin({
      format: 'expanded'
    }),
    chooseMinifySystem(),
    new DuplicatePackageCheckerPlugin(),
    new StatsPlugin('bundle-stats.json', { chunkModules: true }),
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
    new ExtractTextPlugin('static/css/style.[contenthash:8].css'),
    new webpack.LoaderOptionsPlugin({
      debug: false
    })
  ]
})

module.exports = config.merge(loadConfig('webpackConfig', config))
