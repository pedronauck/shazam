const loadConfig = require('./load-config');

module.exports = [{
  loader: 'css-loader',
  options: {
    modules: true,
    importLoaders: true,
    localIdentName: '[local]___[hash:base64:5]'
  }
}, {
  loader: 'postcss-loader',
  options: {
    plugins(bundler) {
      return loadConfig('postcss', bundler) || [];
    }
  }
}];
