import { TCOptions } from '../paramTypes';

export const prefixLog: String = 'TryCache ===> ';

export function criticalLog(message: any): void {
  console.error(prefixLog, message);
}

export default class Logger {
  options: TCOptions;

  constructor(options: TCOptions) {
    this.options = options;
  }

  log(message: string | object, ...args: any): void {
    if (!this.options.silent) console.log(prefixLog, message, ...args);
  }
}
