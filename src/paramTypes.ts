/**
 * @param silent - if true, don't log anything to the console
 * @param expire - the default expiration time in seconds
 */
export type TCOptions = {
  silent: boolean;
  expire: number;
};

/**
 * @param expire - the expiration time in seconds.
 * @param callbackFunction - the function to call if the retrieveFunction throws an error after cache failed.
 * @param forceDB - if true, will force the retrieveFunction to be called even if the key is found in cache. Defaults to false.
 */
export type OperationOptions = {
  expire: number;
  callbackFunction: Function;
  forceDB: boolean;
};
