#!/usr/bin/env node
/* eslint no-unused-expressions: 0, func-names: 0 */

const yargs = require('yargs');

yargs
  .usage('$0 <cmd> [args]')
  .command('init [name]', 'create app structure', {}, function(argv) {
    require('../scripts/init')(argv.name);
  })
  .command('start', 'run development server', {}, function(argv) {
    require('../scripts/start')();
  })
  .command('build', 'build production version of app', {}, function(argv) {
    require('../scripts/build')();
  })
  .help()
  .argv;
