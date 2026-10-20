import { test, expect, beforeEach, afterAll } from 'bun:test';
import { fixtures } from '../fixtures';
import { domain } from '../domain';
import { ContractsManager } from '../../Managers/contracts-manager';
import { TenantsManager } from '../../Managers/tenants-manager';
import { classify } from '../../Managers/contract-rules';
const d = domain(),
  m = new ContractsManager(
    d.db,
    d.access,
    d.records,
    d.sessions,
    new TenantsManager(d.db, d.access, d.records),
  );
beforeEach(fixtures);
afterAll(d.close);
const term = {
  id: 'C',
  tenant_id: 'T',
  start_date: new Date('2026-10-01'),
  end_date: new Date('2026-11-01'),
  termination_date: null as Date | null,
};
test('classification precedence covers start/end/30day boundary and future/effective termination', () => {
  expect(classify(term, '2026-09-30')).toBe('Upcoming');
  expect(classify(term, '2026-10-01')).toBe('Active');
  expect(classify(term, '2026-10-02')).toBe('Expiring Soon');
  expect(classify(term, '2026-11-01')).toBe('Expired');
  expect(classify({ ...term, termination_date: new Date('2026-10-25') }, '2026-10-19')).toBe(
    'Expiring Soon',
  );
  expect(classify({ ...term, termination_date: new Date('2026-10-19') }, '2026-10-19')).toBe(
    'Terminated',
  );
});
test('Manager new contact and first scoped contract commit atomically', async () => {
  const actor = await d.access.actor('U002');
  const input = {
    resource_id: 'R202',
    new_tenant: { name: 'Atomic contact', email: 'atomic@example.test' },
    start_date: '2026-10-19',
    end_date: '2027-10-19',
    monthly_rent_twd: '10000',
    deposit_twd: '20000',
    due_day: 1,
  };
  const before = await d.db.tenant.count();
  const created = await m.create(actor, input);
  expect(created.tenant_name).toBe('Atomic contact');
  expect(created.status).toBe('Active');
  expect(await d.db.tenant.count()).toBe(before + 1);
  expect(await d.db.rentalObligation.count({ where: { contract_id: created.id } })).toBe(0);
});
test('failed or outscope first contracts leave no orphan contacts', async () => {
  const actor = await d.access.actor('U002');
  const before = await d.db.tenant.count();
  const input = {
    new_tenant: { name: 'Rollback contact' },
    start_date: '2026-10-19',
    end_date: '2026-12-19',
    monthly_rent_twd: '10000',
    deposit_twd: '0',
    due_day: 1,
  };
  await expect(m.create(actor, { ...input, resource_id: 'R104' })).rejects.toThrow();
  await expect(m.create(actor, { ...input, resource_id: 'R301' })).rejects.toThrow();
  expect(await d.db.tenant.count()).toBe(before);
});
