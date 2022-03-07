import { defaults } from '../defaults';
import { CacheBrain } from '../index';

(async () => {
  const cb = new CacheBrain(defaults.redis, { silent: false, expire: 10 });
  cb.initCacheBrain();

  const myKey = 'myKey';
  const dummyParamsArray = [2, 7];

  console.log('Retrieving data for the first time');
  const startNoCache = new Date();
  const res1 = await cb.tryCache(myKey, dummyDB, dummyParamsArray);
  const endNoCache = new Date();
  console.log(`First time result: ${res1}, in: ${endNoCache.getTime() - startNoCache.getTime()}ms`);

  console.log('************************************************************************');

  console.log('starting second time, after results are cached');
  sleep(2000);
  const startAfterCache = new Date();
  const res2 = await cb.tryCache(myKey, dummyDB, dummyParamsArray);
  const endAfterCache = new Date();
  console.log(
    `Second time result: ${res2}, in: ${endAfterCache.getTime() - startAfterCache.getTime()}ms`
  );
})();

// simulate a database call
async function dummyDB(x: number, y: number) {
  await sleep(3000);
  return x + y;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
