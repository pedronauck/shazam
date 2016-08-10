import program from 'commander';
import pkg from '../package.json';
import init from './scripts/init';

program
  .version(pkg.version);

program
  .command('init <your_app>')
  .description('create initial app estructure')
  .action(init);

program.parse(process.argv);
