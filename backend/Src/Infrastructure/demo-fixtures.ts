import { Injectable, ForbiddenException } from '@nestjs/common';
import { Database, locks } from './database';
import { Config } from './config';
import { TemporaryStore } from './redis';
import { Access, type Actor } from './access';
import { importFixtures } from './fixture-import';
@Injectable()
export class DemoFixtures {
  constructor(
    private db: Database,
    private config: Config,
    private store: TemporaryStore,
  ) {}
  private assertIsolation() {
    const allowed = this.config.environment === 'test' ? 'rental_demo_test' : 'rental_demo';
    if (
      !this.config.demo ||
      !this.config.isolated ||
      this.config.environment === 'production' ||
      this.config.demoDatabase !== allowed ||
      new URL(this.config.databaseURL).pathname !== '/' + allowed
    )
      throw new ForbiddenException('Explicit isolated demo database required');
  }
  async run(actor?: Actor): Promise<{ ok: true }> {
    this.assertIsolation();
    const password = process.env.DEMO_PASSWORD || '';
    if (Array.from(password).length < 12)
      throw new ForbiddenException('DEMO_PASSWORD requires at least12 characters');
    await this.db.$transaction(
      async (tx) => {
        await locks(tx, ['administration', 'demo-reset']);
        if (actor) {
          const access = new Access(this.db, this.store);
          access.owner(await access.current(actor, tx));
        }
        await importFixtures(tx, password);
      },
      { timeout: 30000 },
    );
    // Durable session versions already revoke old cookies even if Redis is unavailable.
    try {
      let cursor = '0';
      do {
        const [next, keys] = await this.store.client.scan(
          cursor,
          'MATCH',
          this.config.namespace + 'session:*',
          'COUNT',
          100,
        );
        cursor = next;
        if (keys.length)
          await this.store.client.del(...keys.map((k) => k.slice(this.config.namespace.length)));
      } while (cursor !== '0');
    } catch {
      /* Temporary cache cleanup may retry later; old versions remain invalid. */
    }
    return { ok: true };
  }
}
