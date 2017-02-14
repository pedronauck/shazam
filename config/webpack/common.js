const _  = require('lodash');
const chalk = require('chalk');
const emoji = require('node-emoji');
const webpack = require('webpack');
const { Config } = require('webpack-config');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const paths = require('../paths');
const env = require('../env');
const loadConfig = require('../../utils/load-config');
const hourglass = emoji.get(':hourglass:');

const IS_PROD = (process.env.NODE_ENV === 'production');
const PUBLIC_URL = process.env.PUBLIC_URL || '';
const PUBLIC_PATH = '/';

const config = new Config().merge({
  output: {
    pathinfo: true,
    path: paths.app.build,
    publicPath: PUBLIC_PATH
  },
  resolve: {
    extensions: ['.js', '.css'],
    modules: [
      paths.app.src,
      paths.app.nodeModules,
      paths.app.assets
    ],
    moduleExtensions: ["*-loader"],
    alias: {
      'babel-runtime/regenerator': require.resolve('babel-runtime/regenerator'),
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'eslint-loader',
      exclude: /node_modules/,
      enforce: 'pre'
    },{
      test: /\.js$/,
      include: [paths.app.src],
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        query: require(`../babel/${JSON.parse(env['process.env.NODE_ENV'])}`),
      }
    }, {
      test: /\.svg$/,
      loader: 'file-loader',
      include: [paths.app.images, paths.app.nodeModules],
      query: {
        name: 'static/media/[name].[hash:8].[ext]'
      }
    }, {
      exclude: [
        /\.ejs$/,
        /\.html$/,
        /\.(js|jsx)$/,
        /\.css$/,
        /\.json$/,
        /\.svg$/
      ],
      loader: 'url-loader',
      query: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]'
      }
    }]
  },
  plugins: [
    new ProgressBarPlugin({
      format: `${hourglass}  Compiling [${chalk.cyan.bold(':bar')}] ${chalk.cyan.bold(':percent')}`
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin(env),
    new webpack.DefinePlugin({
      'CONFIG': JSON.stringify(loadConfig('envConfig'))
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: `static/js/vendor${IS_PROD ? '.[chunkhash:8]' : ''}.js`,
      minChunks: ({ resource }) => /node_modules/.test(resource)
    }),
    new InterpolateHtmlPlugin(Object.assign({}, { PUBLIC_URL }, loadConfig('htmlData'))),
    new LodashModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({
      test: /\.css$/,
      exclude: /node_modules/,
      options: {
        postcss(bundler) {
          return loadConfig('postcss', bundler) || [];
        }
      }
    })
  ]
});

module.exports = config;
