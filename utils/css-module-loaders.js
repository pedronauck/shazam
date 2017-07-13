const loadConfig = require('./load-config')

module.exports = [{
  loader: 'css-loader',
  options: {
    modules: true,
    importLoaders: true,
    sourceMap: false,
    localIdentName: '[folder]__[local]___[hash:base64:5]'
  }
}, {
  loader: 'postcss-loader',
  options: {
    plugins: bundler => loadConfig('postcss', bundler) || []
  }
}]
