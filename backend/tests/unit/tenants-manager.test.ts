import { test, expect, beforeEach, afterAll } from 'bun:test';
import { fixtures } from '../fixtures';
import { domain } from '../domain';
import { TenantsManager } from '../../Managers/tenants-manager';
import { ListQuery } from '../../Src/Contracts/common.contract';
const d = domain(),
  m = new TenantsManager(d.db, d.access, d.records);
beforeEach(fixtures);
afterAll(d.close);
test('Owner creates unassigned contacts; Manager edits visible contact but cannot create orphan', async () => {
  const owner = await d.access.actor('U001');
  const created = await m.create(owner, {
    name: 'Demo contact',
    email: 'contact@example.test',
    phone: null,
  });
  expect((await m.get(owner, created.id, new ListQuery())).email).toBe('contact@example.test');
  const manager = await d.access.actor('U002');
  await expect(m.create(manager, { name: 'Orphan' })).rejects.toThrow();
  const updated = await m.update(manager, 'TEN001', {
    version: 1,
    name: 'Edited contact',
    phone: 'DEMO-PHONE',
  });
  expect(updated.name).toBe('Edited contact');
  expect((await m.get(manager, 'TEN001', new ListQuery())).phone).toBe('DEMO-PHONE');
});
test('unassigned and outscope contacts stay protected and invalid input rolls back', async () => {
  const manager = await d.access.actor('U002');
  await expect(m.get(manager, 'TEN010', new ListQuery())).rejects.toThrow();
  await expect(m.get(manager, 'TEN004', new ListQuery())).rejects.toThrow();
  await expect(m.update(manager, 'TEN001', { version: 1, name: '   ' })).rejects.toThrow();
  expect((await d.db.tenant.findUniqueOrThrow({ where: { id: 'TEN001' } })).name).toBe(
    'Demo Tenant 01',
  );
});
