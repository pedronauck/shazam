const _  = require('lodash');
const webpack = require('webpack');
const { argv } = require('yargs');
const { Config } = require('webpack-config');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const StatsPlugin = require('stats-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const paths = require('../paths');
const env = require('../env');
const loadConfig = require('../../utils/load-config');

const DEBUG_BUNDLE = argv.debugBundle;
const PUBLIC_URL = process.env.PUBLIC_URL || '';
const PUBLIC_PATH = '/';

const plugins = [
  new webpack.NamedModulesPlugin(),
  new webpack.DefinePlugin(env),
  new webpack.DefinePlugin({
    'CONFIG': JSON.stringify(loadConfig('envConfig'))
  }),
  new InterpolateHtmlPlugin(Object.assign({}, { PUBLIC_URL }, loadConfig('htmlData'))),
  new LodashModuleReplacementPlugin(),
  new webpack.LoaderOptionsPlugin({
    test: /\.css$/,
    options: {
      postcss(bundler) {
        return loadConfig('postcss', bundler) || [];
      }
    }
  })
];

if (DEBUG_BUNDLE) {
  plugins.push(
    new DuplicatePackageCheckerPlugin(),
    new StatsPlugin('bundle-stats.json', {
      chunkModules: true
    })
  );
}

module.exports = new Config().merge({
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
      include: [paths.app.src],
      use: [{
        loader: 'babel-loader',
        query: require(`../babel/${JSON.parse(env['process.env.NODE_ENV'])}`)
      }, {
        loader: 'eslint-loader'
      }]
    }, {
      test: /\.svg$/,
      loader: 'file-loader',
      include: [paths.app.images, paths.app.nodeModules],
      query: {
        name: 'static/media/[name].[hash:8].[ext]'
      }
    }, {
      test: /\.json$/,
      loader: 'json-loader'
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
  plugins
});
