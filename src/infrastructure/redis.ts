import * as redis from 'redis';
import { logger } from '../index';

export class Redis {
  static client: redis.RedisClientType;

  static async connect(redisConnectionString: string) {
    this.client = redis.createClient({
      url: redisConnectionString,
    });

    await this.client.connect();

    this.client.on('error', (err) => logger.log(`Redis Client Error: , ${err.message}`));
  }

  static async quit() {
    await this.client.quit();
  }

  /**
   * getKey - gets a value from redis by a given key.
   * @param key - the key to get.
   */
  static async getKey(key: string): Promise<string | object | null> {
    const value: string | null = await this.client.get(key);
    if (!value) return null;

    const fixedValue: string = value.toString();
    const parsedValue = JSON.parse(fixedValue);
    return parsedValue.TCValue;
  }

  /**
   * setKey - sets a key in redis.
   * @param key - the key to set
   * @param value - the value to set
   * @param expire - the expire time in seconds
   */
  static async setKey(key: string, value: string | object, expire?: number) {
    await this.client.set(key, JSON.stringify({ TCValue: value }));

    if (expire) {
      await this.client.expire(key, expire);
    }
  }
}
