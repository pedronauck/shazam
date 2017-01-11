/* eslint no-console: 0 */

const _ = require('lodash');
const fs = require('fs');
const ora = require('ora');
const { argv } = require('yargs');
const { prompt } = require('inquirer');
const { resolve } = require('path');
const { series } = require('async');
const { capitalize, kebabCase } = require('lodash');
const { red, green, blue } = require('chalk');
const { tick: tickEmoji, cross: crossEmoji, pointer } = require('figures');
const {
  mkdir,
  test,
  exit,
  exec,
  find,
  ls,
  cd,
  cp,
  mv,
  sed,
  cat,
  rm,
  which
} = require('shelljs');

const tick = green(tickEmoji);
const cross = red(crossEmoji);

const DEFAULT_PORT = argv.port;
const IS_DEBUGGING = process.env.DEBUG;
const TEMPLATE_PATH = resolve(__dirname, '../template');

const DEPENDENCIES = [
  'react',
  'react-dom',
  'react-router',
  'react-redux',
  'react-router-redux',
  'redux',
  'redux-thunk',
  'redux-logger'
];

const DEV_DEPENDENCIES = [
  'postcss-cssnext',
  ...!IS_DEBUGGING ? ['shazamjs'] : []
];

const fullPath = (pathname) => resolve(process.cwd(), pathname);

const checkYarnInstalled = () => {
  if (!which('yarn')) {
    console.log(red('Sorry, you need to install Yarn package manager'));
    exit(1);
  }
};

const logFiles = (pathname) =>
  find('-RA', pathname)
    .filter(file => !/.DS_Store/.test(file))
    .forEach(file => console.log(`${tick} ${file.replace(process.cwd(), '.')}`));

const copyDevFiles = (appFullPath) => {
  ls(TEMPLATE_PATH)
    .filter(file => /^_/.test(file))
    .forEach((copiedFile) => {
      cp(`${TEMPLATE_PATH}/${copiedFile}`, appFullPath);
      mv(`${appFullPath}/${copiedFile}`, `${appFullPath}/${copiedFile.replace('_', '.')}`);
    });
};

const copyAppTemplate = (appPath, { template }, cb) => {
  const appFullPath = fullPath(appPath);
  const pathExists = !test('-d', appFullPath);

  console.log(blue(`\n${pointer} Generating app folder and files...`));

  if (pathExists) {
    mkdir('-p', appFullPath);
    cp('-R', `${TEMPLATE_PATH}/${template}`, appFullPath);
    mv(`${appFullPath}/${template}`, `${appFullPath}/app`);

    copyDevFiles(appFullPath);
    logFiles(appFullPath);

    cb();
  }
  else {
    console.log(red(`${pointer} Sorry, this folder already exists!`));
    exit(1);
  }
};

const addAssets = (appPath, answers, cb) => {
  const appFullPath = fullPath(appPath);

  console.log(blue(`\n${pointer} Adding assets...`));

  cp('-R', `${TEMPLATE_PATH}/assets`, `${appFullPath}`);
  mkdir(`${appFullPath}/assets/media`);

  logFiles(`${appFullPath}/assets/*`);

  cb();
};

const copyConfigFile = (filename, appPath, cb) => {
  const appFullPath = fullPath(appPath);
  const newFilename = filename.replace('.tpl', '');
  const filepath = `${appFullPath}/${newFilename}`;

  console.log(blue(`\n${pointer} Creating ${newFilename} file...`))
  console.log(`${tick} ${filepath.replace(process.cwd(), '.')}`);

  cp(`${TEMPLATE_PATH}/${filename}`, appFullPath);
  mv(`${appFullPath}/${filename}`, filepath);

  cb(filepath);
};

const compileTemplateFile = (data) => (filepath) => {
  const fileStr = cat(filepath);
  const compiled = _.template(fileStr);
  const result = compiled(data);

  rm(filepath);
  fs.writeFileSync(filepath, result, 'utf-8');
};

const createConfigFiles = (appPath, answers, cb) => {
  const gitRepo = `${answers.gitUser}/${answers.appName}`;

  copyConfigFile('package.tpl.json', appPath, compileTemplateFile({
    APP_NAME: answers.appName,
    APP_DESCRIPTION: answers.appDescription,
    GITHUB_USER_AND_REPO: gitRepo,
    IS_DEBUGGING
  }));

  copyConfigFile('shazam.tpl.config.js', appPath, compileTemplateFile({
    APP_TITLE: answers.appTitle,
    DEFAULT_PORT
  }));

  cb();
};

const yarnInstall = (type, dependencies, cb) => {
  const spinner = ora(`Downloading ${type}`).start();
  const flag = type === 'dependencies' ? '' : '--dev';
  const cmd = `yarn add ${dependencies.join(' ')} ${flag}`;

  checkYarnInstalled();
  exec(cmd, { silent: true }, (code, stdout, stderr) => {
    if (code === 0) {
      spinner.text = `${capitalize(type)} installed successfuly`;
      spinner.succeed();
      cb();
    }
    else {
      console.log(red(`${cross} Sorry, something wrong happened!\n`))
      console.log(stderr);
      exit(0);
    }
  })
};

const installDependencies = (appPath, cb) => {
  cd(fullPath(appPath));

  console.log(blue(`\n${pointer} Installing dependencies... This may take couple minutes!`));

  yarnInstall('dependencies', DEPENDENCIES, () =>
    yarnInstall('devDependencies', DEV_DEPENDENCIES, () => cb()));
};

module.exports = function(defaultAppName) {
  const prompts = [{
    type: 'input',
    name: 'appTitle',
    message: 'What\'s the title of your project?',
    default: IS_DEBUGGING ? 'Shazam Example' : ''
  },{
    type: 'input',
    name: 'appName',
    message: 'What\'s the name of your project?',
    default: defaultAppName
  }, {
    type: 'input',
    name: 'appDescription',
    message: 'Please type some description:',
    default: IS_DEBUGGING ? 'Just a shazam app example' : ''
  }, {
    type: 'input',
    name: 'gitUser',
    message: 'The owner of your repository on Git:',
    default: IS_DEBUGGING ? 'pedronauck' : ''
  }, {
    type: 'list',
    name: 'template',
    message: 'Which type of template you whant to use?',
    choices: [{
      name: 'Pure React',
      value: 'default'
    }, {
      name: 'React with Router and Redux',
      value: 'with-router-redux'
    }]
  }];

  prompt(prompts).then((answers) => {
    const appPath = kebabCase(answers.appName);

    series([
      (cb) => copyAppTemplate(appPath, answers, cb),
      (cb) => addAssets(appPath, answers, cb),
      (cb) => createConfigFiles(appPath, answers, cb),
      (cb) => installDependencies(appPath, cb)
    ]);
  });
}
