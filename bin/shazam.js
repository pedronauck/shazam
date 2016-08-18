#!/usr/bin/env babel-node --
/* eslint no-unused-expressions: 0, func-names: 0 */

import yargs from 'yargs';
import { init, start, build } from '../scripts';

yargs
  .usage('$0 <cmd> [args]')
  .command('init [name]', 'create app structure', {}, (argv) => {
    init(argv.name);
  })
  .command('start', 'run development server', {}, (argv) => {
    start();
  })
  .command('build', 'build production version of app', {}, (argv) => {
    build();
  })
  .help()
  .argv;
