const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const url = require('url');
const paths = require('./paths');
const env = require('./env');

const homepagePath = require(paths.app.packageJson).homepage;

let publicPath = homepagePath ? url.parse(homepagePath).pathname : '/';

if (!publicPath.endsWith('/')) {
  publicPath += '/';
}

module.exports = {
  bail: true,
  devtool: 'source-map',
  entry: {
    main: [
      require.resolve('./polyfills'),
      path.join(paths.app.src, 'main')
    ]
  },
  output: {
    path: paths.app.build,
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath
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
      query: require('./babel.prod')
    }, {
      test: /\.css$/,
      include: [paths.app.src, paths.app.nodeModules],
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
  eslint: {
    configFile: path.join(__dirname, 'eslint.js'),
    useEslintrc: false
  },
  postcss(bundler) {
    return [
      require('postcss-easy-import')({
        addDependencyTo: bundler,
        path: [paths.app.nodeModules, paths.app.stylesheets],
        glob: true
      }),
      require('postcss-assets')({
        basePath: paths.app.build,
        loadPaths: ['images/'],
        cachebuster: true
      }),
      require('postcss-mixins'),
      require('postcss-simple-vars'),
      require('postcss-font-magician'),
      require('postcss-font-weight-names'),
      require('postcss-pxtorem'),
      require('postcss-cssnext'),
      require('postcss-merge-rules'),
      require('css-mqpacker')
    ];
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.app.htmlFile,
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
    new webpack.DefinePlugin(env),
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
};
