import { CBOptions, RedisDataType } from './paramTypes';
import { Redis } from './infrastructure/redis';
import Logger, { criticalLog } from './utils/logger';
import { defaults } from './defaults';

export let logger: Logger;

export class CacheBrain {
  options: CBOptions;
  redisData: RedisDataType;

  constructor(redisData: RedisDataType, opts?: Partial<CBOptions>) {
    this.redisData = redisData;
    this.options = { ...defaults.defaultOptions, ...opts };
  }

  /**
   * initCacheBot - Initializes the cache bot.
   * @param redisData - the redis data to connect to.
   * @param options - the options to use.
   */
  async initCacheBrain() {
    logger = new Logger(this.options);

    // Init redis connection
    Redis.connect(this.redisData);

    logger.log('successful connection to redis');
  }

  /**
   * tryCache - tries to get a value from redis,
   * if it fails it will return the value from the DB using retrieveFunction.
   * If it succeeds it will return the cached value, and update the cache in the background.
   * @param key - the key to get.
   * @param retrieveFunction - the function to call if the key is not found in cache.
   * @param funcParams - the parameters to pass to the retrieveFunction.
   * @param expire - the expiration time in seconds.
   * @returns the requested cache value, or the result of the retrieveFunction
   * if no cache value is found.
   */
  async tryCache(
    key: string,
    retrieveFunction: Function,
    funcParams: any[],
    expire = this.options.expire
  ): Promise<any> {
    try {
      const cachedValue = await Redis.getKey(key);
      // If no value found, retrieve from DB and set
      if (!cachedValue) {
        const result = await retrieveFunction(...funcParams);
        await Redis.setKey(key, result, expire);
        return result;
      } else {
        // If value found, update the cache in background and return the cached value.
        retrieveFunction(...funcParams)
          .then(async (result: string) => {
            logger.log('Cached value found. Updating cache');
            Redis.setKey(key, result, expire);
          })
          .catch((err: Error) => {
            criticalLog(err);
          });
      }
      return cachedValue;
    } catch (err) {
      criticalLog(err);
    }

    return null;
  }
}
