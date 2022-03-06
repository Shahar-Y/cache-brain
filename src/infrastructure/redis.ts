import * as redis from 'redis';
import { RedisDataType } from '../paramTypes';
import { logger } from '../index';

export class Redis {
  static client: redis.RedisClientType;

  static async connect(redisData: RedisDataType) {
    this.client = redis.createClient(redisData);

    await this.client.connect();

    this.client.on('error', (err) => logger.log(`Redis Client Error: , ${err.message}`));
  }

  /**
   * getKey - gets a value from redis by a given key.
   * @param key - the key to get.
   */
  static async getKey(key: string) {
    return await this.client.get(key);
  }

  /**
   * setKey - sets a key in redis.
   * @param key - the key to set
   * @param value - the value to set
   * @param expire - the expire time in seconds
   */
  static async setKey(key: string, value: string, expire?: number) {
    logger.log(`Setting ${key} to ${value} with expire ${expire}`);
    await this.client.set(key, value);

    if (expire) {
      await this.client.expire(key, expire);
    }
  }
}
