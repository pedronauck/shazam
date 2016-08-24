/*
  eslint
  no-console: 0,
  consistent-return: 0,
  import/imports-first: 0
*/

process.env.NODE_ENV = 'development';

const chalk = require('chalk');
const inquirer = require('inquirer');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const historyApiFallback = require('connect-history-api-fallback');
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const detect = require('detect-port');
const config = require('../config/webpack.config');

let compiler;
let dashboard;
let handleCompile;

const DEFAULT_PORT = process.env.PORT || 3000;

const clearConsole = () => process.stdout.write('\x1bc');

const setupCompiler = (port) => {
  compiler = webpack(config, handleCompile);

  dashboard = new Dashboard();
  compiler.apply(new DashboardPlugin(dashboard.setData));
};

const addMiddleware = (devServer) => {
  devServer.use(historyApiFallback({
    disableDotRule: true,
    htmlAcceptHeaders: ['text/html', '*/*']
  }));

  devServer.use(devServer.middleware);
};

const runDevServer = (port) => {
  const devServer = new WebpackDevServer(compiler, {
    hot: true,
    publicPath: config.output.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/
    }
  });

  addMiddleware(devServer);
  devServer.listen(port, (err, result) => {
    if (err) {
      console.log(chalk.red(err));
    }

    clearConsole();
    console.log(chalk.cyan(`Server listenning on port ${port}`));
  });
};

const run = (port) => {
  setupCompiler(port);
  runDevServer(port);
};

module.exports = function() {
  detect(DEFAULT_PORT).then(port => {
    const prompts = [{
      type: 'input',
      name: 'otherPort',
      message: 'Would you like to run the app on another port?'
    }];

    if (port === DEFAULT_PORT) {
      run(port);
      return;
    }

    clearConsole();
    inquirer.prompt(prompts).then(({ otherPort }) => {
      if (otherPort) {
        run(otherPort);
      }
    });
  });
}
