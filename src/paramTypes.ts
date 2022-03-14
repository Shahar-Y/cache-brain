export type TCOptions = {
  silent: boolean;
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
