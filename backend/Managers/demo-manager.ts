import { Injectable, ForbiddenException } from '@nestjs/common';
import { DemoFixtures } from '../Src/Infrastructure/demo-fixtures';
import { Database, locks } from '../Src/Infrastructure/database';
import { Access, Actor } from '../Src/Infrastructure/access';
import { Config } from '../Src/Infrastructure/config';
import { SessionManager } from './session-manager';
@Injectable()
export class DemoManager {
  constructor(
    private db: Database,
    private access: Access,
    private config: Config,
    private sessions: SessionManager,
    private fixtures: DemoFixtures,
  ) {}
  async read(actor: Actor) {
    await this.access.current(actor);
    return {
      business_date: await this.sessions.date(),
      timezone: 'Asia/Taipei',
      demo_mode: this.config.demo,
    };
  }
  async date(actor: Actor, business_date: string) {
    return this.db.$transaction(async (tx) => {
      await locks(tx, ['administration']);
      this.access.owner(await this.access.current(actor, tx));
      if (!this.config.demo) throw new ForbiddenException('Demo controls are disabled');
      await tx.demoContext.upsert({
        where: { id: 'singleton' },
        create: { id: 'singleton', business_date: new Date(business_date) },
        update: { business_date: new Date(business_date) },
      });
      return { business_date, timezone: 'Asia/Taipei', demo_mode: true };
    });
  }
  async reset(actor: Actor) {
    this.access.owner(await this.access.current(actor));
    if (!this.config.demo) throw new ForbiddenException('Demo controls are disabled');
    return this.fixtures.run(actor);
  }
}
