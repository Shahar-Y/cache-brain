import { TCOptions, OperationOptions } from './paramTypes';
import { Redis } from './infrastructure/redis';
import Logger, { criticalLog } from './utils/logger';
import { defaults } from './defaults';

export let logger: Logger;

export class TryCache {
  options: TCOptions;
  redisConnectionString: string;

  constructor(redisConnectionString: string, opts?: Partial<TCOptions>) {
    this.redisConnectionString = redisConnectionString;
    this.options = { ...defaults.defaultTCOptions, ...opts };
  }

  /**
   * initCacheBot - Initializes the cache bot.
   * @param redisData - the redis data to connect to.
   * @param options - the options to use.
   */
  async initTryCache() {
    logger = new Logger(this.options);

    // Init redis connection
    Redis.connect(this.redisConnectionString);

    logger.log('successful connection to redis');
  }

  /**
   * safeGetFromCache safely gets a value from redis without throwing an error.
   * If no value found or an error is thrown, it will return null.
   * @param key - the key to get.
   * @returns the value from redis, or null if not found or an error is thrown.
   */
  async safeGetFromCache(key: string) {
    try {
      const res = await Redis.getKey(key);
      return res;
    } catch (err) {
      criticalLog(err);
    }
    return null;
  }

  /**
   * safeSetCache - safely sets a value in redis without throwing an error.
   * @param key - the key to set.
   * @param value - the value to set.
   * @param expire - the expire time in seconds.
   * @returns - null.
   */
  async safeSetCache(key: string, value: string, expire?: number) {
    try {
      const res = await Redis.setKey(key, value, expire);
      return res;
    } catch (err) {
      criticalLog(err);
    }
    return null;
  }

  /**
   * tryCache - tries to get a value from redis,
   * if it fails it will return the value from the DB using retrieveFunction.
   * If it succeeds it will return the cached value, and update the cache in the background.
   * @param key - the key to get.
   * @param retrieveFunction - the function to call if the key is not found in cache. <() => func(...params)>.
   * @param opts - the options to use: { expire: number, callbackFunction: Function }.
   * @returns the requested cache value, or the result of the retrieveFunction
   * if no cache value is found.
   */
  async tryCache(
    key: string,
    retrieveFunction: Function,
    opts?: Partial<OperationOptions>
  ): Promise<any> {
    const operationOpts: OperationOptions = {
      expire: opts?.expire ? opts.expire : this.options.expire,
      callbackFunction: opts?.callbackFunction
        ? opts.callbackFunction
        : defaults.defaultCallbackFunction,
    };
    try {
      const cachedValue = await this.safeGetFromCache(key);
      // If no value found, retrieve from DB and set
      if (!cachedValue) {
        const result = await retrieveFunction();
        await this.safeSetCache(key, result, operationOpts.expire);
        return result;
      }

      // If value found, update the cache in background and return the cached value.
      retrieveFunction()
        .then(async (result: string) => {
          await this.safeSetCache(key, result, operationOpts.expire);
        })
        .catch((err: Error) => {
          criticalLog(err);
          operationOpts.callbackFunction();
          throw err;
        });

      return cachedValue;
    } catch (err) {
      criticalLog(err);
      throw err;
    }
  }
}
