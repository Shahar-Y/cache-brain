import { CBOptions, RedisDataType } from './paramTypes';
import { Redis } from './infrastructure/redis';
import Logger, { criticalLog } from './utils/logger';

// Default variables
const defaultOptions: CBOptions = { silent: true, prettify: true };

export let logger: Logger;

/**
 * initCacheBot - Initializes the cache bot.
 * @param redisData - the redis data to connect to.
 * @param options - the options to use.
 */
export async function initCacheBrain(redisData: RedisDataType, opts?: Partial<CBOptions>) {
  const options: CBOptions = { ...defaultOptions, ...opts };
  logger = new Logger(options);

  // Init redis connection
  Redis.connect(redisData);

  logger.log('successful connection to redis');
}

/**
 * tryCache - tries to get a value from redis,
 * if it fails it will return the value from the DB using retrieveFunction.
 * @param key - the key to get.
 * @param retrieveFunction - the function to call if the key is not found in cache.
 * @returns the requested cache value, or the result of the retrieveFunction
 * if no cache value is found.
 */
export async function tryCache(key: string, retrieveFunction: Function): Promise<any> {
  try {
    const value = await Redis.getKey(key);

    // If no value found, retrieve from DB and set
    if (!value) {
      const result = await retrieveFunction();
      return result;
    } else {
      // If
      retrieveFunction()
        .then(async (result: string) => {})
        .catch((err: Error) => {
          criticalLog(err);
        });
    }

    await Redis.setKey(key, result);
  } catch (err) {
    criticalLog(err);
  }

  return Redis.getKey(key);
}
