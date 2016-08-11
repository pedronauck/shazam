/* eslint no-console: 0 */

import _ from 'lodash';
import fs from 'fs';
import ora from 'ora';
import inquirer from 'inquirer';
import figures from 'figures';
import { resolve } from 'path';
import async from 'async';
import { red, green, blue } from 'chalk';
import { mkdir, test, exit, exec, ls, cd, cp, mv } from 'shelljs';

const tick = green(figures.tick);
const cross = red(figures.cross);
const { pointer } = figures;

const TEMPLATE_DIR = resolve(__dirname, '../../template');

const DEPENDENCIES = [
  'react',
  'react-dom',
  'react-router',
  'react-addons-perf',
  'react-hot-loader'
];

const DEV_DEPENDENCIES = [
  'babel',
  'babel-register',
  'babel-cli',
  'babel-eslint',
  'babel-loader',
  'babel-plugin-syntax-object-rest-spread',
  'babel-plugin-transform-class-properties',
  'babel-plugin-transform-export-extensions',
  'babel-plugin-transform-react-pure-class-to-function',
  'babel-plugin-transform-react-remove-prop-types',
  'babel-polyfill',
  'babel-preset-es2015',
  'babel-preset-react',
  'babel-preset-stage-0',
  'eslint',
  'eslint-config-airbnb-base',
  'eslint-plugin-babel',
  'eslint-plugin-import'
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
  const appFullPath = fullPath(appPath);
  const mainFiles = [`${TEMPLATE_DIR}/app/main.js`, `${TEMPLATE_DIR}/app/routes.js`];
  const rootComponent = `${TEMPLATE_DIR}/app/components/Root.js`;
  const layoutsComponent = [
    `${TEMPLATE_DIR}/app/layouts/App.js`,
    `${TEMPLATE_DIR}/app/layouts/NotFound.js`
  ];

  cp(mainFiles, `${appFullPath}/app`);
  cp(rootComponent, `${appFullPath}/app/components`);
  cp(layoutsComponent, `${appFullPath}/app/layouts`);

  cb();
};

const copyEnvConfigFiles = (appPath, cb) => {
  const configDir = 'config';
  const files = ls(`${TEMPLATE_DIR}/${configDir}`);

  console.log(blue(`\n${pointer} Copying environment config files...`));

  cd(fullPath(appPath));
  mkdir(`./${configDir}`);

  files.forEach(filename => {
    cp(`${TEMPLATE_DIR}/${configDir}/${filename}`, `./${configDir}`);
    console.log(`${tick} ./${appPath}/${configDir}/${filename}`);
  });

  cd('../');
  cb();
};

const copyBaseFiles = (appPath, cb) => {
  const files = ls(TEMPLATE_DIR).filter(file => /^_/.test(file));

  console.log(blue(`\n${pointer} Copying base files...`));

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

const createPackageJSON = (appPath, answers, cb) => {
  console.log(blue(`\n${pointer} Setup your package.json...`))

  const appFullPath = fullPath(appPath);
  const depCmd = `npm install --save ${DEPENDENCIES.join(' ')}`;
  const devDepCmd = `npm install --save-dev ${DEV_DEPENDENCIES.join(' ')}`;
  const cmdOpts = { silent: true };
  const template = fs.readFileSync(`${TEMPLATE_DIR}/package.tpl.json`)
    .toString()
    .replace('%%APP_NAME%%', answers.appName)
    .replace('%%APP_DESCRIPTION%%', answers.appDescription)
    .replace(/%%GITHUB_USER_AND_REPO%%/gm, `${answers.gitUser}/${answers.appName}`);

  cd(appFullPath);
  fs.writeFileSync(`${appFullPath}/package.json`, template, 'utf-8');
  console.log(`${tick} ./${appPath}/package.json`);

  console.log(blue(`\n${pointer} Setting npm dependencies...`));

  const depSpinner = ora('Installing dependencies...').start();
  exec(depCmd, cmdOpts, (depCode) => {
    depSpinner.text = 'Dependencies installed successfuly!'
    depSpinner.succeed();

    const devDepSpinner = ora('Installing devDependencies...').start();
    exec(devDepCmd, cmdOpts, (devDepCode) => {
      if (depCode === 0 && devDepCode === 0) {
        devDepSpinner.text = 'devDependencies installed successfuly!'
        devDepSpinner.succeed();
        cd('../');
        cb();
      } else {
        console.log(red(`${cross} Sorry, something wrong happened!`))
        exit(0);
      }
    });
  });
};

export default function(defaultAppName) {
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

  inquirer.prompt(prompts).then((answers) => {
    const appPath = _.kebabCase(answers.appName);

    async.series([
      (cb) => createAppStructure(appPath, cb),
      (cb) => copyMainComponents(appPath, cb),
      (cb) => copyBaseFiles(appPath, cb),
      (cb) => copyEnvConfigFiles(appPath, cb),
      (cb) => createPackageJSON(appPath, answers, cb)
    ]);
  });
}
