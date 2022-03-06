import { CBOptions } from '../paramTypes';

export const prefixLog: String = 'REDBIT ===> ';

export function criticalLog(message: any): void {
  console.error(prefixLog, message);
}

export default class Logger {
  options: CBOptions;

  constructor(options: CBOptions) {
    this.options = options;
  }

  log(message: string | object): void {
    if (!this.options.silent) console.log(prefixLog, message);
  }
}
