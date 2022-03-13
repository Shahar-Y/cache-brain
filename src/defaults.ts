import { TCOptions } from './paramTypes';

// Default variables
const defaultTCOptions: TCOptions = { silent: true, prettify: true, expire: 5 * 60 };

export const defaults = {
  redis: {
    port: 6379,
    host: 'localhost',
    dbIndex: 0,
    password: '',
  },
  defaultTCOptions: defaultTCOptions,
  defaultCallbackFunction: () => {},
};
