/* eslint no-console: 0 */

const ora = require('ora');
const { readFileSync, writeFileSync } = require('fs');
const { prompt } = require('inquirer');
const { resolve } = require('path');
const { series } = require('async');
const { capitalize, kebabCase } = require('lodash');
const { red, green, blue } = require('chalk');
const { tick: tickEmoji, cross: crossEmoji, pointer } = require('figures');
const { mkdir, test, exit, exec, find, ls, cd, cp, mv } = require('shelljs');

const tick = green(tickEmoji);
const cross = red(crossEmoji);

const TEMPLATE_DIR = resolve(__dirname, '../template');

const DEPENDENCIES = [
  '@drvem/components',
  '@drvem/shazam',
  'react',
  'react-dom',
  'react-router',
  'react-addons-perf',
  'react-redux',
  'react-router-redux',
  'redux',
  'redux-ignore',
  'redux-thunk',
  'redux-logger',
  'humps',
  'isomorphic-fetch'
];

const DEV_DEPENDENCIES = [
  'eslint',
  'eslint-plugin-flowtype',
  'eslint-plugin-react',
  'eslint-plugin-jsx-a11y',
  'eslint-plugin-import',
  'react-hot-loader@3.0.0-beta.2'
];

const APP_FOLDERS = [
  'app',
  'app/actions',
  'app/components',
  'app/components/shared',
  'app/constants',
  'app/layouts',
  'app/reducers',
  'app/utils',
  'app/views',
];

const fullPath = (pathname) => resolve(process.cwd(), pathname);

const createAppStructure = (appPath, cb) => {
  const appFullPath = fullPath(appPath);

  if (!test('-d', appFullPath)) {
    mkdir('-p', appFullPath);
    cd(appFullPath);
    mkdir('-p', APP_FOLDERS);
    cd('../');

    console.log(blue(`${pointer} Creating app structure...`));
    APP_FOLDERS.forEach(folder => console.log(`${tick} ./${appPath}/${folder}`));

    cb();
  } else {
    console.log(red(`${pointer} Sorry, this folder already exists!`));
    exit(1);
  }
};

const copyMainComponents = (appPath, cb) => {
  cp('-R', `${TEMPLATE_DIR}/app`, fullPath(appPath));
  cb();
};

const addAssets = (appPath, cb) => {
  const appFullPath = fullPath(appPath);
  const folders = ['components', 'layouts', 'mixins', 'views'];

  console.log(blue(`\n${pointer} Adding assets folders and files...`));

  cp('-R', `${TEMPLATE_DIR}/assets`, `${appFullPath}`);
  mkdir(`${appFullPath}/assets/images`);
  mkdir(`${appFullPath}/assets/media`);
  mkdir(folders.map(folder => `${appFullPath}/assets/stylesheets/${folder}`));

  find(`${appFullPath}/assets/*`).forEach(file =>
    console.log(`${tick} ${file.replace(process.cwd(), '.')}`));

  cb();
};

const copyBaseFiles = (appPath, cb) => {
  console.log(blue(`\n${pointer} Copying base files...`));

  const appFullPath = fullPath(appPath);

  ls(TEMPLATE_DIR)
    .filter(file => /^_/.test(file))
    .forEach((copiedFile) => {
      const filename = copiedFile.replace('_', '.');

      cp(`${TEMPLATE_DIR}/${copiedFile}`, appFullPath);
      mv(`${appFullPath}/${copiedFile}`, `${appFullPath}/${filename}`);

      console.log(`${tick} ./${appPath}/${filename}`);
    });

  cb();
};

const createPackageJSON = (appPath, answers, cb) => {
  const appFullPath = fullPath(appPath);
  const template = readFileSync(`${TEMPLATE_DIR}/package.tpl.json`)
    .toString()
    .replace('%%APP_NAME%%', answers.appName)
    .replace('%%APP_DESCRIPTION%%', answers.appDescription)
    .replace(/%%GITHUB_USER_AND_REPO%%/gm, `${answers.gitUser}/${answers.appName}`);

  console.log(blue(`\n${pointer} Setup your package.json...`))
  writeFileSync(`${appFullPath}/package.json`, template, 'utf-8');
  console.log(`${tick} ./${appPath}/package.json`);

  cb();
};

const createShazamConfig = (appPath, cb) => {
  const appFullPath = fullPath(appPath);
  const filename = 'shazam.tpl.config.js';

  cp(`${TEMPLATE_DIR}/${filename}`, appFullPath);
  mv(`${appFullPath}/${filename}`, `${appFullPath}/${filename.replace('.tpl', '')}`);
  cb();
};

const installDependencies = (type, dependencies, cb) => {
  const spinner = ora(`Downloading ${type}`).start();
  const flag = type === 'dependencies' ? '--save' : '--save-dev';
  const cmd = `npm i ${flag} ${dependencies.join(' ')}`;

  exec(cmd, { silent: true }, (code) => {
    if (code === 0) {
      spinner.text = `${capitalize(type)} installed successfuly`;
      spinner.succeed();
      cb();
    }
    else {
      console.log(red(`${cross} Sorry, something wrong happened!`))
      exit(0);
    }
  })
};

const installNpmDependencies = (appPath, cb) => {
  cd(fullPath(appPath));

  console.log(blue(`\n${pointer} Installing npm packages... This may take couple minutes!`));
  installDependencies('dependencies', DEPENDENCIES, () => {
    installDependencies('devDependencies', DEV_DEPENDENCIES, () => {
      cb();
    });
  });
};

module.exports = function(defaultAppName) {
  const prompts = [{
    type: 'input',
    name: 'appName',
    message: 'What is the name of your project?',
    default: defaultAppName
  }, {
    type: 'input',
    name: 'appDescription',
    message: 'Please type some description:'
  }, {
    type: 'input',
    name: 'gitUser',
    message: 'The owner of your repository on Git:'
  }];

  prompt(prompts).then((answers) => {
    const appPath = kebabCase(answers.appName);

    series([
      (cb) => createAppStructure(appPath, cb),
      (cb) => copyMainComponents(appPath, cb),
      (cb) => addAssets(appPath, cb),
      (cb) => copyBaseFiles(appPath, cb),
      (cb) => createPackageJSON(appPath, answers, cb),
      (cb) => createShazamConfig(appPath, cb),
      (cb) => installNpmDependencies(appPath, cb)
    ]);
  });
}
