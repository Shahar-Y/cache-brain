import { Redis } from '../infrastructure/redis';
import { defaults } from '../defaults';
import { TryCache } from '../index';

(async () => {
  const cb = new TryCache(defaults.redis, { silent: false, expire: 20 });
  cb.initTryCache();

  const myKey = 'myKey';

  console.log('Retrieving data for the first time');
  const startNoCache = new Date();
  const res1 = await cb.tryCache(myKey, () => dummyDB(2, 7, false));
  const endNoCache = new Date();
  console.log(`First time result: ${res1}, in: ${endNoCache.getTime() - startNoCache.getTime()}ms`);

  console.log('************************************************************************');

  console.log('Starting second time, after results are cached');
  await sleep(5000);
  const startAfterCache = new Date();
  const res2 = await cb.tryCache(myKey, () => dummyDB(2, 7, false));
  const endAfterCache = new Date();
  console.log(
    `Second time result: ${res2}, in: ${endAfterCache.getTime() - startAfterCache.getTime()}ms`
  );

  console.log('************************************************************************');

  console.log('Starting third time, function should fail!');
  await sleep(5000);
  const startError = new Date();

  // catch the unhandled rejection in client
  process.on('unhandledRejection', (err) => {
    console.log(`Caught the error successfully!: ${err}`);
    const endError = new Date();
    console.log(`Caught 3rd run error in: ${endError.getTime() - startError.getTime()}ms`);
  });

  // Call the function that should fail asunchronously
  const res3 = await cb.tryCache(myKey, () => dummyDB(2, 7, true));

  console.log('************************************************************************');

  // console.log('Starting 4th time, after results are cached');
  // await sleep(5000);
  // const startAfterCache = new Date();
  // const res2 = await cb.tryCache(myKey, () => dummyDB(2, 7, false));
  // const endAfterCache = new Date();
  // console.log(
  //   `Second time result: ${res2}, in: ${endAfterCache.getTime() - startAfterCache.getTime()}ms`
  // );
})();

// simulate a database call
async function dummyDB(x: number, y: number, shouldFail: boolean) {
  await sleep(3000);
  if (shouldFail) {
    throw new Error('Failed Successfully');
  }
  return x + y;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// todo: read
process.on('SIGINT', async () => {
  console.log('Closing gracefully');
  await Redis.quit();
  console.log('Shutdown complete');
  process.exit(0);
});
