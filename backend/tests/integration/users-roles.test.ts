import { test, expect, beforeEach, afterAll } from 'bun:test';
import { fixtures, db, password } from '../fixtures';
import { Config } from '../../Src/Infrastructure/config';
import { Database } from '../../Src/Infrastructure/database';
import { TemporaryStore } from '../../Src/Infrastructure/redis';
import { Access } from '../../Src/Infrastructure/access';
import { UsersManager } from '../../Managers/users-manager';
const store = new TemporaryStore(new Config()),
  access = new Access(db as Database, store),
  users = new UsersManager(db as Database, access);
beforeEach(fixtures);
afterAll(async () => {
  await store.onModuleDestroy();
  await db.$disconnect();
});
test('Owner creates users, grants scope, role/password/grant changes invalidate sessions', async () => {
  const owner = await access.actor('U001');
  const created: any = await users.create(owner, {
    email: 'other@example.test',
    display_name: 'Other',
    password,
    enabled: true,
    role: 'VIEWER',
  });
  expect(created.role).toBe('VIEWER');
  expect(JSON.stringify(created)).not.toContain('password');
  const session = await access.login('manager@example.test', password);
  await users.grants(owner, 'U002', { version: 1, property_ids: ['P003'] });
  await expect(access.authenticate(session.id)).rejects.toThrow();
  expect((await access.actor('U002')).property_ids).toEqual(['P003']);
  const second = await access.login('manager@example.test', password);
  await users.password(owner, 'U002', password + 'new');
  await expect(access.authenticate(second.id)).rejects.toThrow();
});
test('Manager/Viewer cannot escalate or grant/assign ownership; last/owning Owner protected', async () => {
  const owner = await access.actor('U001');
  for (const id of ['U002', 'U003']) {
    const actor = await access.actor(id);
    await expect(users.update(actor, id, { version: 1, role: 'OWNER' })).rejects.toThrow();
    await expect(users.grants(actor, id, { version: 1, property_ids: ['P003'] })).rejects.toThrow();
    await expect(users.owner(actor, 'P001', { version: 1, owner_user_id: id })).rejects.toThrow();
  }
  await expect(users.update(owner, 'U001', { version: 1, role: 'MANAGER' })).rejects.toThrow();
  await expect(users.update(owner, 'U001', { version: 1, enabled: false })).rejects.toThrow();
  expect((await db.user.findUniqueOrThrow({ where: { id: 'U001' } })).enabled).toBe(true);
});
test('owner assignment and demotion serialize on shared administration lock', async () => {
  const actor = await access.actor('U001');
  const second: any = await users.create(actor, {
    email: 'owner2@example.test',
    display_name: 'Owner 2',
    password,
    enabled: true,
    role: 'OWNER',
  });
  const outcomes = await Promise.allSettled([
    users.owner(actor, 'P001', { version: 1, owner_user_id: second.id }),
    users.update(actor, second.id, { version: 1, role: 'MANAGER' }),
  ]);
  expect(outcomes.filter((x) => x.status === 'fulfilled').length).toBeGreaterThan(0);
  const property = await db.property.findUniqueOrThrow({
    where: { id: 'P001' },
    include: { owner: true },
  });
  expect(property.owner.enabled).toBe(true);
  expect(property.owner.role).toBe('OWNER');
});
test('concurrent Owner demotions cannot remove every enabled Owner', async () => {
  const actor = await access.actor('U001');
  const second: any = await users.create(actor, {
    email: 'owner2@example.test',
    display_name: 'Owner 2',
    password,
    enabled: true,
    role: 'OWNER',
  });
  await db.$transaction(async (tx) => {
    await tx.contract.updateMany({ data: { primary_document_id: null } });
    await tx.documentContent.deleteMany();
    await tx.document.deleteMany();
    await tx.paymentRecord.deleteMany();
    await tx.rentalObligation.deleteMany();
    await tx.contract.deleteMany();
    await tx.propertyAccess.deleteMany();
    await tx.resource.deleteMany();
    await tx.property.deleteMany();
  });
  await Promise.allSettled([
    users.update(actor, 'U001', { version: 1, role: 'MANAGER' }),
    users.update(await access.actor(second.id), second.id, { version: 1, role: 'MANAGER' }),
  ]);
  expect(await db.user.count({ where: { role: 'OWNER', enabled: true } })).toBe(1);
});
