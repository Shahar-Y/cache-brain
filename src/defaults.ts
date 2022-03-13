import { TCOptions } from './paramTypes';

// Default variables
const defaultTCOptions: TCOptions = { silent: true, expire: 5 * 60 };

export const defaults = {
  defaultTCOptions: defaultTCOptions,
  redisConnectionString: 'redis://localhost:6379',
  defaultCallbackFunction: () => {},
};
