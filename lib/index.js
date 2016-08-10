import program from 'commander';
import pkg from '../package.json';

program
  .version(pkg.version);

program.parse(process.argv);
