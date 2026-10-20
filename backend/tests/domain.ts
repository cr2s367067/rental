import { Database } from '../Src/Infrastructure/database';
import { Config } from '../Src/Infrastructure/config';
import { TemporaryStore } from '../Src/Infrastructure/redis';
import { Access } from '../Src/Infrastructure/access';
import { SessionManager } from '../Managers/session-manager';
import { RecordsManager } from '../Managers/records-manager';
import { db } from './fixtures';
export function domain() {
  const config = new Config(),
    store = new TemporaryStore(config),
    access = new Access(db as Database, store),
    sessions = new SessionManager(db as Database, access, config),
    records = new RecordsManager(db as Database, access, sessions);
  return {
    config,
    store,
    access,
    sessions,
    records,
    db: db as Database,
    close: async () => {
      await store.onModuleDestroy();
      await db.$disconnect();
    },
  };
}
