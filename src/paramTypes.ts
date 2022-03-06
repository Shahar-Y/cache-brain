export type RedisDataType = {
  host: string;
  port: number;
  password: string;
  dbIndex: number;
};

export type CBOptions = {
  silent: boolean;
  prettify: boolean;
};
