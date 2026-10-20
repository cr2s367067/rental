import { RecordsManager } from '../../Managers/records-manager';
import { test, expect, beforeEach, afterAll } from 'bun:test';
import { fixtures, db } from '../fixtures';
import { Database } from '../../Src/Infrastructure/database';
import { TemporaryStore } from '../../Src/Infrastructure/redis';
import { Config } from '../../Src/Infrastructure/config';
import { Access } from '../../Src/Infrastructure/access';
import { SessionManager } from '../../Managers/session-manager';
import { PropertiesManager } from '../../Managers/properties-manager';
import { ListQuery } from '../../Src/Contracts/common.contract';
const config = new Config(),
  store = new TemporaryStore(config),
  access = new Access(db as Database, store),
  sessions = new SessionManager(db as Database, access, config),
  manager = new PropertiesManager(
    db as Database,
    access,
    sessions,
    new RecordsManager(db as Database, access, sessions),
  );
beforeEach(fixtures);
afterAll(async () => {
  await store.onModuleDestroy();
  await db.$disconnect();
});
test('Owner saves and reopens property/resource; Manager edits scoped details', async () => {
  const owner = await access.actor('U001');
  const property = await manager.create(owner, {
    name: 'Demo property',
    city: 'Taipei',
    address: 'DEMO',
    owner_user_id: 'U001',
    rental_mode: 'ROOMS',
  });
  const resource = await manager.createResource(owner, property.id, {
    name: 'Room 1',
    kind: 'ROOM',
    capacity: 2,
  });
  const reopened = await manager.get(owner, property.id, new ListQuery());
  expect(reopened.resources[0].id).toBe(resource.id);
  await manager.update(await access.actor('U002'), 'P001', { version: 1, name: 'Edited' });
  expect((await manager.get(owner, 'P001', new ListQuery())).name).toBe('Edited');
});
test('invalid capacity/mode/scope edits preserve prior records', async () => {
  const owner = await access.actor('U001');
  await expect(
    manager.updateResource(owner, 'R104', { version: 1, capacity: 1 }),
  ).rejects.toThrow();
  expect((await db.resource.findUniqueOrThrow({ where: { id: 'R104' } })).capacity).toBe(2);
  await expect(
    manager.createResource(owner, 'P004', { name: 'Room', kind: 'ROOM', capacity: 1 }),
  ).rejects.toThrow();
  await expect(
    manager.update(await access.actor('U002'), 'P003', { version: 1, name: 'Denied' }),
  ).rejects.toThrow();
  await expect(
    manager.update(await access.actor('U002'), 'P001', {
      version: 1,
      rental_mode: 'WHOLE_PROPERTY',
    }),
  ).rejects.toThrow();
  expect((await db.property.findUniqueOrThrow({ where: { id: 'P003' } })).name).toBe(
    'Demo Kaohsiung House',
  );
});
test('availability is start-inclusive/end-exclusive contract projection with shared slots', async () => {
  const owner = await access.actor('U001');
  const resources = await manager.resources(owner, new ListQuery());
  expect(resources.total).toBe(11);
  const shared = resources.items.find((r: any) => r.id === 'R104')!;
  expect(shared.current_count).toBe(2);
  expect(shared.available_slots).toBe(0);
  const q = Object.assign(new ListQuery(), { business_date: '2026-10-24' });
  expect(
    (await manager.resources(owner, q)).items.find((r: any) => r.id === 'R104')!.current_count,
  ).toBe(1);
});
