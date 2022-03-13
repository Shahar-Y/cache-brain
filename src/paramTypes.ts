export type RedisDataType = {
  host: string;
  port: number;
  password: string;
  dbIndex: number;
};

export type TCOptions = {
  silent: boolean;
  prettify: boolean;
  expire: number;
};

/**
 * expire - the expiration time in seconds.
 * callbackFunction - the function to call if the retrieveFunction throws an error after cache failed.
 */
export type OperationOptions = {
  expire: number;
  callbackFunction: Function;
};
