import program from 'commander';
import pkg from '../package.json';
import { init, start } from './scripts';

program
  .version(pkg.version);

program
  .command('init <your_app>')
  .description('generates app default structure')
  .action(init);

program.parse(process.argv);
