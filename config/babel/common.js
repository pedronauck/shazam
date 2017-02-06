const path = require('path');

module.exports = {
  babelrc: false,
  cacheDirectory: true,
  presets: [
    [require.resolve('babel-preset-latest'), { modules: false }],
    require.resolve('babel-preset-react')
  ],
  plugins: [
    require.resolve('babel-plugin-lodash'),
    require.resolve('babel-plugin-syntax-dynamic-import'),
    require.resolve('babel-plugin-syntax-trailing-function-commas'),
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-transform-export-extensions'),
    [require.resolve('babel-plugin-transform-object-rest-spread'), {
      useBuiltIns: true
    }],
    [require.resolve('babel-plugin-transform-react-jsx'), {
      useBuiltIns: true
    }],
    [require.resolve('babel-plugin-transform-runtime'), {
      helpers: false,
      polyfill: false,
      regenerator: true,
      moduleName: path.dirname(require.resolve('babel-runtime/package'))
    }]
  ]
};
