import { TCDefaultOptions } from '../paramTypes';

export const prefixLog: String = 'TryCache ===> ';

export function criticalLog(message: any): void {
  console.error(prefixLog, message);
}

export default class Logger {
  options: TCDefaultOptions;

  constructor(options: TCDefaultOptions) {
    this.options = options;
  }

  /**
   * log - logs a message to the console.
   * @param message - the message to log.
   * @param forceLog - if true, will force the logger to log even if silent is true.
   * @param args - any additional arguments to pass to the console.log function.
   */
  log(message: string | object, forceLog: boolean, ...args: any): void {
    if (!this.options.silent || forceLog) console.log(prefixLog, message, ...args);
  }
}
