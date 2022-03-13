import { Redis } from '../infrastructure/redis';
import { defaults } from '../defaults';
import { TryCache } from '../index';

(async () => {
  const cb = new TryCache(defaults.redisConnectionString, { silent: false, expire: 20 });
  cb.initTryCache();

  const waitMs = 2000;
  const myKey = 'myKey';

  console.log('Retrieving data for the first time');
  console.time('1st run time taken');
  const res1 = await cb.tryCache(myKey, () => dummyDB(2, 7, false));
  console.log(`First time result: ${res1}`);
  console.timeEnd('1st run time taken');

  console.log('************************************************************************');

  console.log('Starting second time, after results are cached');
  await sleep(waitMs);
  console.time('2nd run time taken');
  const res2 = await cb.tryCache(myKey, () => dummyDB(2, 7, false));
  console.log(`Second time result: ${res2}`);
  console.timeEnd('2nd run time taken');

  console.log('************************************************************************');

  console.log('Starting third time, function should fail!');
  await sleep(waitMs);
  console.time('3rd run time taken');

  // Catch the unhandled rejection in client
  process.on('unhandledRejection', (err) => {
    console.log(`Caught the error successfully!: ${err}`);
    console.timeEnd('3rd run time taken');
    console.log(`Caught 3rd run error`);
  });

  // Call the function that should fail asunchronously
  const res3 = await cb.tryCache(myKey, () => dummyDB(2, 7, true));

  console.log('************************************************************************');

  console.log('Starting 4th time, after results are cached');
  await sleep(waitMs);
  console.time('4th run time taken');
  const res4 = await cb.tryCache(myKey, () => dummyDB(2, 7, true), {
    expire: 30,
    callbackFunction: () => console.log('Callback function called'),
  });
  console.timeEnd('4th run time taken');
  console.log(`Fourth time result: ${res4}`);
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

// Close gracefully on ctrl+c
process.on('SIGINT', async () => {
  console.log('Closing gracefully');
  await Redis.quit();
  console.log('Shutdown complete');
  process.exit(0);
});
