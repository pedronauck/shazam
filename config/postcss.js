const paths = require('./paths');

module.exports = function(bundler) {
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
}
