/* eslint no-console: 0 */

import _ from 'lodash';
import ora from 'ora';
import figures from 'figures';
import { resolve, join } from 'path';
import async from 'async';
import { red, green, blue } from 'chalk';
import { mkdir, test, exit, ls, cd, cp, mv } from 'shelljs';

const tick = green(figures.tick);
const cross = red(figures.cross);
const { pointer } = figures;

const TEMPLATE_DIR = resolve(__dirname, '../../template');

const fullPath = (pathname) => resolve(process.cwd(), pathname);

const createAppStructure = (appPath, cb) => {
  const appFullPath = fullPath(appPath);
  const folders = [
    'app',
    'app/actions',
    'app/components',
    'app/components/shared',
    'app/constants',
    'app/layouts',
    'app/reducers',
    'app/utils',
    'app/views',
    'config',
  ];

  if (!test('-d', appPath)) {
    mkdir('-p', appFullPath);
    cd(appFullPath);
    mkdir('-p', folders);
    cd('../');

    console.log(blue(`${pointer} Create app structure`));
    folders.forEach(folder => console.log(`${tick} ./${appPath}/${folder}`));

    cb();
  } else {
    console.log(red(`${pointer} Sorry, this folder already exists!`));
    exit(1);
  }
};

const copyEnvConfigFiles = (appPath, cb) => {
  const dirToCopy = 'config';
  const files = ls(`${TEMPLATE_DIR}/${dirToCopy}`);

  cd(fullPath(appPath));

  files.forEach(filename => {
    cp(`${TEMPLATE_DIR}/${dirToCopy}/${filename}`, `./${dirToCopy}`);
    console.log(`${tick} ./${appPath}/${dirToCopy}/${filename}`);
  });

  cd('../');
  cb();
};

const copyBaseFiles = (appPath, cb) => {
  const files = ls(TEMPLATE_DIR).filter(file => /^_/.test(file));

  cd(fullPath(appPath));

  files.forEach(copiedFile => {
    const filename = copiedFile.replace('_', '.');

    cp(`${TEMPLATE_DIR}/${copiedFile}`, './');
    mv(`./${copiedFile}`, `./${filename}`);

    console.log(`${tick} ./${appPath}/${filename}`);
  });

  cd('../');
  cb();
};

export default function(appName) {
  const appPath = _.kebabCase(appName);

  const funcs = [
    (cb) => createAppStructure(appPath, cb),
    (cb) => copyEnvConfigFiles(appPath, cb),
    (cb) => copyBaseFiles(appPath, cb)
  ];

  async.series(funcs);
}
