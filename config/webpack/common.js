/* eslint new-cap: 0 */
process.noDeprecation = true

const { argv } = require('yargs')
const webpack = require('webpack')
const { Config } = require('webpack-config')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const HappyPack = require('happypack')

const paths = require('../paths')
const env = require('../env')
const loadConfig = require('../../utils/load-config')

const IS_PROD = (process.env.NODE_ENV === 'production')
const PUBLIC_URL = process.env.PUBLIC_URL || ''
const PUBLIC_PATH = '/'
const HAS_HAPPYPACK = argv.happypack

const jsLoader = Object.assign({
  test: /\.(js|jsx)$/,
  include: [paths.app.src],
  exclude: /node_modules/,
  loader: [HAS_HAPPYPACK ? 'happypack/loader?id=js' : 'babel-loader']
}, HAS_HAPPYPACK && {
  query: require(`../babel/${JSON.parse(env['process.env.NODE_ENV'])}`)
})

const plugins = [
  new webpack.NamedModulesPlugin(),
  new webpack.DefinePlugin(env),
  new webpack.DefinePlugin({
    CONFIG: JSON.stringify(loadConfig('envConfig'))
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: `static/js/vendor${IS_PROD ? '.[chunkhash:8]' : ''}.js`,
    minChunks: ({ resource }) => /node_modules/.test(resource)
  }),
  new InterpolateHtmlPlugin(Object.assign({}, { PUBLIC_URL }, loadConfig('htmlData'))),
  new LodashModuleReplacementPlugin()
]

if (HAS_HAPPYPACK) {
  plugins.push(new HappyPack({
    id: 'js',
    threadPool: HappyPack.ThreadPool({ size: 5 }),
    loaders: [{
      loader: 'babel-loader',
      query: require(`../babel/${JSON.parse(env['process.env.NODE_ENV'])}`)
    }]
  }))
}

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
    moduleExtensions: ['*-loader'],
    alias: {
      'babel-runtime/regenerator': require.resolve('babel-runtime/regenerator')
    }
  },
  module: {
    rules: [jsLoader, {
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
  plugins
})

module.exports = config
