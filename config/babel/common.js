module.exports = {
  babelrc: false,
  cacheDirectory: true,
  presets: [
    require.resolve('babel-preset-latest'),
    require.resolve('babel-preset-stage-1'),
    require.resolve('babel-preset-react')
  ],
  plugins: [
    require.resolve('babel-plugin-syntax-trailing-function-commas'),
    require.resolve('babel-plugin-transform-class-properties'),
    require.resolve('babel-plugin-transform-object-rest-spread'),
    require.resolve('babel-plugin-transform-export-extensions'),
    [require.resolve('babel-plugin-transform-runtime'), {
      helpers: false,
      polyfill: false
    }]
  ]
};
