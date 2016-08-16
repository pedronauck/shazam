module.exports = {
  babelrc: false,
  cacheDirectory: true,
  presets: [
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-es2016'),
    require.resolve('babel-preset-react')
  ],
  plugins: [
    require.resolve('react-hot-loader/babel'),
    require.resolve('babel-plugin-syntax-trailing-function-commas'),
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-transform-object-rest-spread'),
    require.resolve('babel-plugin-transform-react-pure-class-to-function'),
    require.resolve('babel-plugin-transform-react-remove-prop-types'),
    require.resolve('babel-plugin-transform-export-extensions'),
    [require.resolve('babel-plugin-transform-runtime'), {
      helpers: false,
      polyfill: false
    }]
  ]
};
