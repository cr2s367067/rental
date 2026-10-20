import { Config } from '../Src/Infrastructure/config';
import { Database } from '../Src/Infrastructure/database';
import { TemporaryStore } from '../Src/Infrastructure/redis';
import { DemoFixtures } from '../Src/Infrastructure/demo-fixtures';
const config = new Config(),
  db = new Database(config),
  store = new TemporaryStore(config);
try {
  await new DemoFixtures(db, config, store).run();
  console.log('Synthetic demo imported transactionally; previous sessions invalidated.');
} catch {
  console.error(
    'Demo import refused or failed. Check isolated demo configuration and service availability.',
  );
  process.exitCode = 1;
} finally {
  await store.onModuleDestroy();
  await db.$disconnect();
}
