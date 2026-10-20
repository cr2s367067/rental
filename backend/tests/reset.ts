import Redis from 'ioredis';
import { fixtures, db, testDatabaseURL } from './fixtures';
export async function resetTestFixtures() {
  await fixtures();
  const redis = new Redis(process.env.REDIS_URL!);
  const keys = await redis.keys('rental:' + new URL(testDatabaseURL).pathname + ':*');
  if (keys.length) await redis.del(...keys);
  await redis.quit();
  await db.$disconnect();
}
