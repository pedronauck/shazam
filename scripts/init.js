/* eslint no-console: 0 */

const ora = require('ora');
const { prompt } = require('inquirer');
const { resolve } = require('path');
const { series } = require('async');
const { capitalize, kebabCase } = require('lodash');
const { red, green, blue } = require('chalk');
const { tick: tickEmoji, cross: crossEmoji, pointer } = require('figures');
const { mkdir, test, exit, exec, find, ls, cd, cp, mv, sed } = require('shelljs');

const tick = green(tickEmoji);
const cross = red(crossEmoji);

const TEMPLATE_PATH = resolve(__dirname, '../template');

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

const fullPath = (pathname) => resolve(process.cwd(), pathname);

const logFiles = (pathname) =>
  find('-RA', pathname)
    .forEach(file => console.log(`${tick} ${file.replace(process.cwd(), '.')}`));

const copyDevFiles = (appFullPath) => {
  ls(TEMPLATE_PATH)
    .filter(file => /^_/.test(file))
    .forEach((copiedFile) => {
      cp(`${TEMPLATE_PATH}/${copiedFile}`, appFullPath);
      mv(`${appFullPath}/${copiedFile}`, `${appFullPath}/${copiedFile.replace('_', '.')}`);
    });
};

const copyAppTemplate = (appPath, answers, cb) => {
  const appFullPath = fullPath(appPath);
  const pathExists = !test('-d', appFullPath);

  console.log(blue(`\n${pointer} Generating app folder and files...`));

  if (pathExists) {
    mkdir('-p', appFullPath);
    cp('-R', `${TEMPLATE_PATH}/app`, fullPath(appPath));
    sed('-i', /%%APP_TITLE%%/, answers.appTitle, `${appFullPath}/app/layouts/App.js`);

    copyDevFiles(appFullPath);
    logFiles(appFullPath);

    cb();
  } else {
    console.log(red(`${pointer} Sorry, this folder already exists!`));
    exit(1);
  }
};

const addAssets = (appPath, cb) => {
  const appFullPath = fullPath(appPath);
  const folders = ['components', 'layouts', 'mixins', 'views'];

  console.log(blue(`\n${pointer} Adding assets...`));

  cp('-R', `${TEMPLATE_PATH}/assets`, `${appFullPath}`);
  mkdir(`${appFullPath}/assets/images`);
  mkdir(`${appFullPath}/assets/media`);
  mkdir(folders.map(folder => `${appFullPath}/assets/stylesheets/${folder}`));
  logFiles(`${appFullPath}/assets/*`);

  cb();
};

const copyConfigFile = (filename, appPath, cb) => {
  const appFullPath = fullPath(appPath);
  const newFilename = filename.replace('.tpl', '');
  const filepath = `${appFullPath}/${newFilename}`;

  console.log(blue(`\n${pointer} Creating ${filename} file...`))
  console.log(`${tick} ${filepath.replace(process.cwd(), '.')}`);

  cp(`${TEMPLATE_PATH}/${filename}`, appFullPath);
  mv(`${appFullPath}/${filename}`, filepath);

  cb(filepath);
};

const createConfigFiles = (appPath, answers, cb) => {
  const gitRepo = `${answers.gitUser}/${answers.appName}`;

  copyConfigFile('package.tpl.json', appPath, (filepath) => {
    sed('-i', /%%APP_NAME%%/, answers.appName, filepath);
    sed('-i', /%%APP_DESCRIPTION%%/, answers.appDescription, filepath);
    sed('-i', /%%GITHUB_USER_AND_REPO%%/gm, gitRepo, filepath);
  });

  copyConfigFile('shazam.tpl.config.js', appPath, (filepath) => {
    sed('-i', /%%APP_TITLE%%/, answers.appTitle, filepath);
  });

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
    name: 'appTitle',
    message: 'What\'s the title of your project?'
  },{
    type: 'input',
    name: 'appName',
    message: 'What\'s the name of your project?',
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
      (cb) => copyAppTemplate(appPath, answers, cb),
      (cb) => addAssets(appPath, cb),
      (cb) => createConfigFiles(appPath, answers, cb),
      (cb) => installNpmDependencies(appPath, cb)
    ]);
  });
}
