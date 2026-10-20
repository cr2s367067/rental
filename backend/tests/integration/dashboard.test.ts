import { test, expect, beforeEach, afterAll } from 'bun:test';
import { readFileSync } from 'node:fs';
import { fixtures } from '../fixtures';
import { domain } from '../domain';
import { DashboardManager } from '../../Managers/dashboard-manager';
import { PropertiesManager } from '../../Managers/properties-manager';
import { StaysManager } from '../../Managers/stays-manager';
import { TenantsManager } from '../../Managers/tenants-manager';
import { ContractsManager } from '../../Managers/contracts-manager';
import { BillingManager } from '../../Managers/billing-manager';
import { PaymentsManager } from '../../Managers/payments-manager';
import { DashboardQuery, type MetricKey } from '../../Src/Contracts/dashboard.contract';
import { ListQuery } from '../../Src/Contracts/common.contract';
import { ownerIds, managerIds, viewerIds } from '../dashboard-expected';
import type { Actor } from '../../Src/Infrastructure/access';
const d = domain(),
  m = new DashboardManager(d.records),
  tenants = new TenantsManager(d.db, d.access, d.records),
  properties = new PropertiesManager(d.db, d.access, d.sessions, d.records),
  stays = new StaysManager(d.records),
  contracts = new ContractsManager(d.db, d.access, d.records, d.sessions, tenants),
  billing = new BillingManager(d.db, d.access, d.records, contracts),
  payments = new PaymentsManager(d.db, d.access, d.sessions);
beforeEach(fixtures);
afterAll(d.close);
async function drill(
  actor: Actor,
  path: string,
  query: ListQuery,
): Promise<{ items: { id: string }[]; total: number }> {
  switch (path) {
    case '/properties':
      return properties.list(actor, query);
    case '/resources':
      return properties.resources(actor, query);
    case '/tenants':
      return tenants.list(actor, query);
    case '/stays':
      return stays.list(actor, query);
    case '/contracts':
      return contracts.list(actor, query);
    case '/payments':
      return billing.list(actor, query);
    default:
      throw Error('Unexpected drill path');
  }
}
for (const [id, ids] of [
  ['U001', ownerIds],
  ['U002', managerIds],
  ['U003', viewerIds],
] as const)
  test(id + ' metrics match golden counts and complete paginated drill record IDs', async () => {
    const expected = JSON.parse(
      readFileSync('specs/001-property-management/mock-data/expected-results.json', 'utf8'),
    ).dashboard_by_user[id];
    const actor = await d.access.actor(id),
      result = await m.get(actor, new DashboardQuery());
    expect(result.counts).toEqual(expected);
    expect(result.metrics.length).toBe(9);
    for (const metric of result.metrics) {
      const all: string[] = [];
      let page = 1;
      while (true) {
        const response = await drill(
          actor,
          metric.path,
          Object.assign(new ListQuery(), metric.query, { page, page_size: 2 }),
        );
        expect(response.total).toBe(metric.count);
        all.push(...response.items.map((r) => r.id));
        if (all.length >= response.total) break;
        page++;
        if (page > 20) throw Error('Pagination did not converge');
      }
      expect([...all].sort()).toEqual([...ids[metric.key as MetricKey]].sort());
      expect(new Set(all).size).toBe(all.length);
    }
    expect(result.counts.occupied_resources + result.counts.available_resources).toBe(
      result.counts.total_resources,
    );
  });
test('property/date boundaries and forbidden scope reuse the same definitions', async () => {
  const owner = await d.access.actor('U001');
  const expected = JSON.parse(
    readFileSync('specs/001-property-management/mock-data/expected-results.json', 'utf8'),
  ).dashboard_by_user.U003;
  expect((await m.get(owner, { property_id: 'P001' })).counts).toEqual(expected);
  await expect(m.get(await d.access.actor('U002'), { property_id: 'P003' })).rejects.toThrow();
  const at22 = await m.get(owner, { business_date: '2026-10-22' });
  expect(at22.counts).toMatchObject({
    occupied_resources: 6,
    available_resources: 5,
    current_tenants: 7,
    upcoming_contract_starts: 0,
  });
  const at24 = await m.get(owner, { business_date: '2026-10-24' });
  expect(at24.counts.current_tenants).toBe(6);
  expect(at24.counts.upcoming_contract_ends).toBe(0);
});
test('empty permitted scope returns real zeros and nine usable drill filters', async () => {
  await d.db.propertyAccess.deleteMany({ where: { user_id: 'U003' } });
  const result = await m.get(await d.access.actor('U003'), new DashboardQuery());
  expect(result.counts.total_properties).toBe(0);
  expect(result.counts.outstanding_twd).toBe('0');
  expect(result.metrics.length).toBe(9);
  expect(result.metrics.every((m) => m.count === 0)).toBe(true);
});
test('concurrent payment refresh returns complete before/after snapshots then matching records', async () => {
  const actor = await d.access.actor('U001');
  const [first, second] = await Promise.all([
    m.get(actor, new DashboardQuery()),
    m.get(actor, new DashboardQuery()),
    payments.record(actor, 'OBL004', { amount_twd: '11000' }, 'dashboard-payment'),
  ]);
  for (const response of [first, second]) {
    expect([5, 4]).toContain(response.counts.unpaid_rent_periods);
    expect(response.counts.outstanding_twd).toBe(
      response.counts.unpaid_rent_periods === 5 ? '74000' : '63000',
    );
  }
  const final = await m.get(actor, new DashboardQuery()),
    list = await billing.list(
      actor,
      Object.assign(new ListQuery(), { metric: 'unpaid_rent_periods' }),
    );
  expect(final.counts.unpaid_rent_periods).toBe(list.total);
  expect(final.counts.outstanding_twd).toBe(
    list.items.reduce((n, o) => n + BigInt(o.outstanding_twd), 0n).toString(),
  );
});
