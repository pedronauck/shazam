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
const httpProxyMiddleware = require('http-proxy-middleware');
const detect = require('detect-port');
const { exit } = require('shelljs');
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

const addMiddleware = (devServer) => {
  const proxy = require(paths.app.packageJson).proxy;

  devServer.use(historyApiFallback({
    disableDotRule: true,
    htmlAcceptHeaders: proxy ? ['text/html'] : ['text/html', '*/*']
  }));

  if (proxy) {
    if (typeof proxy !== 'string') {
      console.log(chalk.red('When specified, "proxy" in package.json must be a string.'));
      console.log(chalk.red(`Instead, the type of "proxy" was "${typeof proxy}".`));
      console.log(chalk.red('Either remove "proxy" from package.json, or make it a string.'));
      exit(1);
    }

    const mayProxy = /^(?!\/(index\.html$|.*\.hot-update\.json$|sockjs-node\/)).*$/;

    devServer.use(mayProxy,
      httpProxyMiddleware(pathname => mayProxy.test(pathname), {
        target: proxy,
        logLevel: 'silent',
        secure: false,
        changeOrigin: true
      })
    );
  }

  devServer.use(devServer.middleware);
};

const runDevServer = (port) => {
  const devServer = new WebpackDevServer(compiler, {
    hot: true,
    publicPath: config.output.publicPath,
    quiet: true,
    watchOptions: { ignored: /node_modules/ }
  });

  addMiddleware(devServer);

  devServer.listen(port, (err) => {
    if (err) {
      return console.log(chalk.red(err))
    }

    clearConsole();
    console.log(chalk.cyan('Starting the development server...\n'));
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
