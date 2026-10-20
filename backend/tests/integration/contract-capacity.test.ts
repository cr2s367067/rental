import { test, expect, beforeEach, afterAll } from 'bun:test';
import { fixtures } from '../fixtures';
import { domain } from '../domain';
import { ContractsManager } from '../../Managers/contracts-manager';
import { TenantsManager } from '../../Managers/tenants-manager';
import { PropertiesManager } from '../../Managers/properties-manager';
import { ListQuery } from '../../Src/Contracts/common.contract';
const d = domain(),
  m = new ContractsManager(
    d.db,
    d.access,
    d.records,
    d.sessions,
    new TenantsManager(d.db, d.access, d.records),
  ),
  p = new PropertiesManager(d.db, d.access, d.sessions, d.records);
beforeEach(fixtures);
afterAll(d.close);
const terms = {
  start_date: '2026-10-19',
  end_date: '2026-11-19',
  monthly_rent_twd: '10000',
  deposit_twd: '0',
  due_day: 1,
};
test('event sweep permits sequential commitments but rejects true duplicate tenant overlap', async () => {
  const a = await d.access.actor('U001');
  await m.create(a, {
    ...terms,
    resource_id: 'R202',
    tenant_id: 'TEN001',
    start_date: '2026-11-01',
    end_date: '2026-11-10',
  });
  await m.create(a, {
    ...terms,
    resource_id: 'R202',
    tenant_id: 'TEN002',
    start_date: '2026-11-10',
    end_date: '2026-11-20',
  });
  const c = await m.create(a, {
    ...terms,
    resource_id: 'R202',
    tenant_id: 'TEN003',
    start_date: '2026-10-19',
    end_date: '2026-11-01',
  });
  expect(c.resource_id).toBe('R202');
  await p.updateResource(a, 'R104', { version: 1, capacity: 3 });
  await expect(
    m.create(a, { ...terms, resource_id: 'R104', tenant_id: 'TEN005' }),
  ).rejects.toThrow();
});
test('contract creation versus capacity reduction uses the same resource transaction lock', async () => {
  const a = await d.access.actor('U001');
  await p.updateResource(a, 'R202', { version: 1, capacity: 2 });
  await m.create(a, { ...terms, resource_id: 'R202', tenant_id: 'TEN001' });
  const result = await Promise.allSettled([
    m.create(a, { ...terms, resource_id: 'R202', tenant_id: 'TEN002' }),
    p.updateResource(a, 'R202', { version: 2, capacity: 1 }),
  ]);
  expect(result.filter((r) => r.status === 'fulfilled').length).toBe(1);
  const data = await p.resources(a, Object.assign(new ListQuery(), { resource_id: 'R202' }));
  expect(data.items[0].current_count).toBeLessThanOrEqual(data.items[0].capacity);
});
test('simultaneous first contracts at capacity1 commit only one contact and contract', async () => {
  const a = await d.access.actor('U002');
  const before = await d.db.tenant.count();
  const result = await Promise.allSettled(
    ['One', 'Two'].map((name) =>
      m.create(a, { ...terms, resource_id: 'R202', new_tenant: { name } }),
    ),
  );
  expect(result.filter((r) => r.status === 'fulfilled').length).toBe(1);
  expect(await d.db.tenant.count()).toBe(before + 1);
  expect(await d.db.contract.count({ where: { resource_id: 'R202' } })).toBe(1);
});
test('reassignment/termination version conflicts retain valid intervals and document relationships', async () => {
  const a = await d.access.actor('U001');
  const moved = await m.update(a, 'C001', { version: 1, resource_id: 'R202' });
  expect(moved.resource_id).toBe('R202');
  await expect(m.update(a, 'C001', { version: 1, end_date: '2028-01-01' })).rejects.toThrow();
  const ended = await m.terminate(a, 'C001', { version: 2, termination_date: '2026-10-19' });
  expect(ended.status).toBe('Terminated');
  expect(
    (await p.resources(a, Object.assign(new ListQuery(), { resource_id: 'R202' }))).items[0]
      .current_count,
  ).toBe(0);
  expect((await d.db.document.findUniqueOrThrow({ where: { id: 'DOC-C001' } })).property_id).toBe(
    'P002',
  );
});
