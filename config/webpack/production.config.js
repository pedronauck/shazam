import { join, resolve } from 'path';
import Config from 'webpack-config';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import paths from '../paths';
import babelQuery from '../babel.prod';

const shazamConfig = require(paths.app.shazamConfig);

export default new Config().extend(resolve(__dirname, './base.config.js')).merge({
  bail: true,
  devtool: 'source-map',
  entry: {
    main: [
      require.resolve('./polyfills'),
      join(paths.app.src, 'main')
    ]
  },
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js'
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
      loader: ExtractTextPlugin.extract('style', '!css?minimize!postcss')
    }, {
      test: /\.(jpg|png|gif|eot|svg|ttf|woff|woff2)(\?.*)?$/,
      include: [paths.app.images, paths.app.nodeModules],
      loader: 'file',
      query: {
        name: 'static/media/[name].[hash:8].[ext]'
      }
    }, {
      test: /\.(mp4|webm)(\?.*)?$/,
      include: [paths.app.media, paths.app.nodeModules],
      loader: 'url',
      query: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]'
      }
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.app.htmlFile,
      data: shazamConfig.htmlData.production || {},
      // favicon: paths.appFavicon,
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
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    new ExtractTextPlugin('static/css/[name].[contenthash:8].css')
  ]
});
