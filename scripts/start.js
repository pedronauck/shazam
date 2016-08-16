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
const detect = require('detect-port');
const config = require('../config/webpack.config.dev');
const paths = require('../config/paths');

const DEFAULT_PORT = process.env.PORT || 3000;
let compiler;
let handleCompile;

const friendlySyntaxErrorLabel = 'Syntax error:';

const isLikelyASyntaxError = (message) =>
  message.indexOf(friendlySyntaxErrorLabel) !== -1;

const formatMessage = (message) =>
  message
    .replace('Module build failed: SyntaxError:', friendlySyntaxErrorLabel)
    .replace(
      /Module not found: Error: Cannot resolve 'file' or 'directory'/,
      'Module not found:'
    )
    .replace(/^\s*at\s.*:\d+:\d+[\s\)]*\n/gm, '')
    .replace('./~/css-loader!./~/postcss-loader!', '');

const clearConsole = () =>
  process.stdout.write('\x1bc');

const setupCompiler = (port) => {
  compiler = webpack(config, handleCompile);

  compiler.plugin('invalid', () => {
    clearConsole();
    console.log('Compiling...');
  });

  compiler.plugin('done', (stats) => {
    clearConsole();

    const hasErrors = stats.hasErrors();
    const hasWarnings = stats.hasWarnings();
    const json = stats.toJson({}, true);
    const formattedWarnings = json.warnings.map(message => `Warning in ${formatMessage(message)}`);
    let formattedErrors = json.errors.map(message => `Error in ${formatMessage(message)}`);

    if (!hasErrors && !hasWarnings) {
      console.log(chalk.green('Compiled successfully!'));
      console.log('\nThe app is running at:');
      console.log(chalk.cyan(`http://localhost:${port}/`));
      console.log('\nNote that the development build is not optimized.');
      console.log(`To create a production build, use ${chalk.cyan('npm run build')}.\n`);
      return;
    }

    if (hasErrors) {
      console.log(chalk.red('Failed to compile.\n'));

      if (formattedErrors.some(isLikelyASyntaxError)) {
        formattedErrors = formattedErrors.filter(isLikelyASyntaxError);
      }

      formattedErrors.forEach(message => {
        console.log(message);
        console.log();
      });

      return;
    }

    if (hasWarnings) {
      console.log(chalk.yellow('Compiled with warnings.'));
      console.log();

      formattedWarnings.forEach(message => {
        console.log(message);
        console.log();
      });

      console.log('You may use special comments to disable some warnings.');
      console.log(`Use ${chalk.yellow('// eslint-disable-next-line')} to ignore the next line.`);
      console.log(`Use ${chalk.yellow('/* eslint-disable */')} to ignore all warnings in a file.`);
    }
  });
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
  app.use(webpackHotMiddleware(compiler));

  app.get('*', (req, res) => {
    const file = middleware.fileSystem.readFileSync(`${paths.app.build}/index.html`);
    res.send(file);
  });

  app.listen(port, 'localhost', (err) => {
    if (err) console.log(err);
    console.log(`Server listenning on port ${port}`);
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
