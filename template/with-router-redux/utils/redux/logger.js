import createLogger from 'redux-logger';
import { hasDevTools } from './devtools';

const cancelLogger = () => (next) => (action) => next(action);
export const loggerMiddleware = hasDevTools() ? cancelLogger : createLogger();
