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

const setupCompiler = (port) => {
  compiler = webpack(config, handleCompile);
  dashboard = new Dashboard();

  compiler.apply(new DashboardPlugin(dashboard.setData));
};

const runDevServer = (port) => {
  const server = new WebpackDevServer(compiler, {
    publicPath: config.output.publicPath,
    hot: true,
    quiet: true,
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/
    }
  });

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
