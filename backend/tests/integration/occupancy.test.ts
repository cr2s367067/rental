import { beforeEach, afterAll, test, expect } from 'bun:test';
import { fixtures } from '../fixtures';
import { domain } from '../domain';
import { StaysManager } from '../../Managers/stays-manager';
import { PropertiesManager } from '../../Managers/properties-manager';
import { ListQuery } from '../../Src/Contracts/common.contract';
const d = domain(),
  stays = new StaysManager(d.records),
  properties = new PropertiesManager(d.db, d.access, d.sessions, d.records);
beforeEach(fixtures);
afterAll(d.close);
test('persisted contract projection and concurrent capacity writes preserve shared room', async () => {
  const actor = await d.access.actor('U001');
  expect((await stays.list(actor, new ListQuery())).total).toBe(9);
  expect(
    (
      await properties.resources(
        actor,
        Object.assign(new ListQuery(), { business_date: '2026-10-24' }),
      )
    ).items.find((r) => r.id === 'R104')?.current_count,
  ).toBe(1);
  await expect(
    properties.updateResource(actor, 'R104', { version: 1, capacity: 1 }),
  ).rejects.toThrow();
  const result = await Promise.allSettled([
    properties.updateResource(actor, 'R104', { version: 1, capacity: 3 }),
    properties.updateResource(actor, 'R104', { version: 1, capacity: 2 }),
  ]);
  expect(result.filter((r) => r.status === 'fulfilled').length).toBe(1);
  const resource = await d.db.resource.findUniqueOrThrow({ where: { id: 'R104' } });
  expect(resource.capacity).toBeGreaterThanOrEqual(2);
  expect(resource.version).toBe(2);
});
