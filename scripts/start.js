/*
  eslint
  no-console: 0,
  consistent-return: 0,
  import/imports-first: 0
*/

process.env.NODE_ENV = 'development';

const chalk = require('chalk');
const inquirer = require('inquirer');
const express = require('express');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');
const detect = require('detect-port');
const config = require('../config/webpack.config');
const paths = require('../config/paths');

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

const runDevServer = (port) => {
  const app = express();
  const middleware = webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
    historyApiFallback: true,
    quiet: true,
    watchOptions: { ignored: /node_modules/ }
  });

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler, {
    log: () => {}
  }));

  app.get('*', (req, res) => {
    const file = middleware.fileSystem.readFileSync(`${paths.app.build}/index.html`);
    res.send(file);
  });

  app.listen(port, 'localhost', (err) => {
    if (err) console.log(chalk.red(err));
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
