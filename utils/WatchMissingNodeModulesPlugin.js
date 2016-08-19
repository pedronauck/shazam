/* eslint func-names: 0 */

function WatchMissingNodeModulesPlugin(nodeModulesPath) {
  this.nodeModulesPath = nodeModulesPath;
}

WatchMissingNodeModulesPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', (compilation, callback) => {
    const missingDeps = compilation.missingDependencies;
    const nodeModulesPath = this.nodeModulesPath;

    if (missingDeps.some(file => file.indexOf(nodeModulesPath) !== -1)) {
      compilation.contextDependencies.push(nodeModulesPath);
    }

    callback();
  });
};

module.exports = WatchMissingNodeModulesPlugin;
