import { resolve } from 'path';
import Config, { environment } from 'webpack-config';
import env from './env';

environment.setAll({
  env: () => JSON.parse(env['process.env.NODE_ENV'])
});

export default new Config().extend(resolve(__dirname, './webpack/[env].config.js'));
