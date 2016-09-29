/*
  eslint
  no-console: 0,
  consistent-return: 0,
  import/imports-first: 0
*/

process.env.NODE_ENV = 'development';

const argv = require('yargs').argv;
const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const { exit } = require('shelljs');
const config = require('../config/webpack.config');

let compiler;
let dashboard;
let handleCompile;

const DEFAULT_PORT = argv.port || 3000;
const hasHotLoader = argv.hotLoader;

const setupCompiler = (port) => {
  compiler = webpack(config, handleCompile);

  if (argv.dashboard) {
    dashboard = new Dashboard();
    compiler.apply(new DashboardPlugin(dashboard.setData));
  }
};

const runDevServer = (port) => {
  const opts = {
    publicPath: config.output.publicPath,
    hot: hasHotLoader,
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/
    },
    stats: {
      colors: true,
      chunks: false,
      chunkModules: false
    }
  };

  if (argv.dashboard) Object.assign(opts, { quiet: true });

  const server = new WebpackDevServer(compiler, opts);

  server.listen(port, (err) => {
    if (err) {
      console.log(chalk.red(err));
      exit(1);
    }
  });
};

module.exports = function() {
  setupCompiler(DEFAULT_PORT);
  runDevServer(DEFAULT_PORT);
}
