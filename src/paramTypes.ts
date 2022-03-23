export type TCOptions = {
  silent: boolean;
  expire: number;
};

/**
 * expire - the expiration time in seconds.
 * callbackFunction - the function to call if the retrieveFunction throws an error after cache failed.
 * forceDB - if true, will force the retrieveFunction to be called even if the key is found in cache. Defaults to false.
 */
export type OperationOptions = {
  expire: number;
  callbackFunction: Function;
  forceDB: boolean;
};
