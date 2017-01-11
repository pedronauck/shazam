/*
  eslint
  no-param-reassign: 0,
  no-console: 0,
  prefer-template: 0,
  max-len: 0,
  no-multi-spaces: 0,
  no-use-before-define: 0,
  import/imports-first: 0
*/

process.env.NODE_ENV = 'production';

const chalk = require('chalk');
const fs = require('fs');
const del = require('del');
const path = require('path');
const filesize = require('filesize');
const webpack = require('webpack');
const recursive = require('recursive-readdir');
const stripAnsi = require('strip-ansi');
const { exit } = require('shelljs');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');

const config = require('../config/webpack.config');
const paths = require('../config/paths');

const gzipSize = require('gzip-size').sync;

if (!checkRequiredFiles([paths.app.htmlFile, paths.app.mainJSFile])) {
  exit(1);
}

const removeFileNameHash = (fileName) =>
  fileName
    .replace(paths.app.build, '')
    .replace(/\/?(.*)(\.\w+)(\.js|\.css)/, (match, p1, p2, p3) => p1 + p3);

const getDifferenceLabel = (currentSize, previousSize) => {
  const FIFTY_KILOBYTES = 1024 * 50;
  const difference = currentSize - previousSize;
  const fileSize = !Number.isNaN(difference) ? filesize(difference) : 0;

  if (difference >= FIFTY_KILOBYTES) {
    return chalk.red(`+${fileSize}`);
  } else if (difference < FIFTY_KILOBYTES && difference > 0) {
    return chalk.yellow(`+${fileSize}`);
  } else if (difference < 0) {
    return chalk.green(fileSize);
  }

  return '';
};

const build = (previousSizeMap) => {
  console.log('Creating an optimized production build...');

  webpack(config).run((err, stats) => {
    if (err) {
      console.error('Failed to create a production build. Reason:');
      console.error(err.message || err);
      exit(1);
    }

    console.log(chalk.green('Compiled successfully.\n'));

    console.log('File sizes after gzip:\n');
    printFileSizes(stats, previousSizeMap);
    console.log();

    const openCommand = process.platform === 'win32' ? 'start' : 'open';
    const homepagePath = require(paths.app.packageJson).homepage;
    const publicPath = config.output.publicPath;

    if (homepagePath && homepagePath.indexOf('.github.io/') !== -1) {
      console.log('The project was built assuming it is hosted at ' + chalk.green(publicPath) + '.');
      console.log('You can control this with the ' + chalk.green('homepage') + ' field in your '  + chalk.cyan('package.json') + '.');
      console.log();
      console.log('The ' + chalk.cyan('build') + ' folder is ready to be deployed.');
      console.log('To publish it at ' + chalk.green(homepagePath) + ', run:');
      console.log();
      console.log('  ' + chalk.cyan('git') + ' commit -am ' + chalk.yellow('"Save local changes"'));
      console.log('  ' + chalk.cyan('git') + ' checkout -B gh-pages');
      console.log('  ' + chalk.cyan('git') + ' add -f build');
      console.log('  ' + chalk.cyan('git') + ' commit -am ' + chalk.yellow('"Rebuild website"'));
      console.log('  ' + chalk.cyan('git') + ' filter-branch -f --prune-empty --subdirectory-filter build');
      console.log('  ' + chalk.cyan('git') + ' push -f origin gh-pages');
      console.log('  ' + chalk.cyan('git') + ' checkout -');
      console.log();
    } else if (publicPath !== '/') {
      console.log('The project was built assuming it is hosted at ' + chalk.green(publicPath) + '.');
      console.log('You can control this with the ' + chalk.green('homepage') + ' field in your '  + chalk.cyan('package.json') + '.');
      console.log();
      console.log('The ' + chalk.cyan('build') + ' folder is ready to be deployed.');
      console.log();
    } else {
      console.log('The project was built assuming it is hosted at the server root.');

      if (homepagePath) {
        console.log('You can control this with the ' + chalk.green('homepage') + ' field in your '  + chalk.cyan('package.json') + '.');
        console.log();
      } else {
        console.log('To override this, specify the ' + chalk.green('homepage') + ' in your '  + chalk.cyan('package.json') + '.');
        console.log('For example, add this to build it for GitHub Pages:')
        console.log();
        console.log('  ' + chalk.green('"homepage"') + chalk.cyan(': ') + chalk.green('"http://myname.github.io/myapp"') + chalk.cyan(','));
        console.log();
      }
      console.log('The ' + chalk.cyan('build') + ' folder is ready to be deployed.');
      console.log('You may also serve it locally with a static server:')
      console.log();
      console.log('  ' + chalk.cyan('npm') +  ' install -g pushstate-server');
      console.log('  ' + chalk.cyan('pushstate-server') + ' build');
      console.log('  ' + chalk.cyan(openCommand) + ' http://localhost:9000');
      console.log();
    }
  });
};

const printFileSizes = (stats, previousSizeMap) => {
  const assets = stats.toJson().assets
    .filter(asset => /\.(js|css)$/.test(asset.name))
    .map(asset => {
      const fileContents = fs.readFileSync(`${paths.app.build}/${asset.name}`);
      const size = gzipSize(fileContents);
      const previousSize = previousSizeMap[removeFileNameHash(asset.name)];
      const difference = getDifferenceLabel(size, previousSize);

      return {
        folder: path.join('build', path.dirname(asset.name)),
        name: path.basename(asset.name),
        size,
        sizeLabel: filesize(size) + (difference ? ` (${difference})` : '')
      };
    });

  assets.sort((a, b) => b.size - a.size);

  const longestSizeLabelLength = Math.max.apply(null,
    assets.map(a => stripAnsi(a.sizeLabel).length)
  );

  assets.forEach((asset) => {
    let sizeLabel = asset.sizeLabel;
    const sizeLength = stripAnsi(sizeLabel).length;

    if (sizeLength < longestSizeLabelLength) {
      const rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
      sizeLabel += rightPadding;
    }

    console.log(
      '  ' + sizeLabel +
      '  ' + chalk.dim(asset.folder + path.sep) + chalk.cyan(asset.name)
    );
  });
};

module.exports = function() {
  recursive(paths.app.build, (err, fileNames) => {
    const previousSizeMap = (fileNames || [])
      .filter(fileName => /\.(js|css)$/.test(fileName))
      .reduce((memo, fileName) => {
        const contents = fs.readFileSync(fileName);
        const key = removeFileNameHash(fileName);

        memo[key] = gzipSize(contents);

        return memo;
      }, {});

    del.sync(paths.app.build);
    build(previousSizeMap);
  });
}
