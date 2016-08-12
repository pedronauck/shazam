/* eslint no-console: 0 */

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const ora = require('ora');
const inquirer = require('inquirer');
const figures = require('figures');
const async = require('async');
const { resolve } = require('path');
const { red, green, blue } = require('chalk');
const { mkdir, test, exit, exec, find, ls, cd, cp, mv } = require('shelljs');

const tick = green(figures.tick);
const cross = red(figures.cross);
const { pointer } = figures;

const TEMPLATE_DIR = path.resolve(__dirname, '../template');

const DEPENDENCIES = [
  '@drvem/components',
  '@drvem/shazam',
  'react',
  'react-dom',
  'react-router',
  'react-addons-perf'
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
  const homeComponent = `${TEMPLATE_DIR}/app/views/Home.js`;
  const layoutsComponent = [
    `${TEMPLATE_DIR}/app/layouts/App.js`,
    `${TEMPLATE_DIR}/app/layouts/NotFound.js`
  ];

  cp(mainFiles, `${appFullPath}/app`);
  cp(rootComponent, `${appFullPath}/app/components`);
  cp(layoutsComponent, `${appFullPath}/app/layouts`);
  cp(homeComponent, `${appFullPath}/app/views`);

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
  const cmdOpts = { silent: true };
  const templateStr = fs.readFileSync(`${TEMPLATE_DIR}/package.tpl.json`)
    .toString()
    .replace('%%APP_NAME%%', answers.appName)
    .replace('%%APP_DESCRIPTION%%', answers.appDescription)
    .replace(/%%GITHUB_USER_AND_REPO%%/gm, `${answers.gitUser}/${answers.appName}`);

  cd(appFullPath);
  fs.writeFileSync(`${appFullPath}/package.json`, templateStr, 'utf-8');
  console.log(`${tick} ./${appPath}/package.json`);

  console.log(blue(`\n${pointer} Setting npm dependencies...`));

  const spinner = ora('Installing dependencies...').start();
  exec(depCmd, cmdOpts, (depCode) => {
    if (depCode === 0) {
      spinner.text = 'Dependencies installed successfuly!'
      spinner.succeed();
      cd('../');
      cb();
    } else {
      console.log(red(`${cross} Sorry, something wrong happened!`))
      exit(0);
    }
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

  inquirer.prompt(prompts).then((answers) => {
    const appPath = _.kebabCase(answers.appName);

    async.series([
      (cb) => createAppStructure(appPath, cb),
      (cb) => copyMainComponents(appPath, cb),
      (cb) => addAssets(appPath, cb),
      (cb) => copyBaseFiles(appPath, cb),
      (cb) => copyEnvConfigFiles(appPath, cb),
      (cb) => createPackageJSON(appPath, answers, cb)
    ]);
  });
}
