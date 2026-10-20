import { beforeAll, beforeEach, afterAll, test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { httpServer } from '../http';
let api: Awaited<ReturnType<typeof httpServer>>;
beforeAll(async () => {
  api = await httpServer();
});
beforeEach(async () => api.reset());
afterAll(async () => api.close());
test('registered dashboard keeps HTTP role/date scope and all drill totals consistent before pagination', async () => {
  const golden = JSON.parse(
    readFileSync('specs/001-property-management/mock-data/expected-results.json', 'utf8'),
  ).dashboard_by_user;
  expect((await api.request('/dashboard', {})).status).toBe(401);
  for (const [email, id] of [
    ['owner@example.test', 'U001'],
    ['manager@example.test', 'U002'],
    ['viewer@example.test', 'U003'],
  ]) {
    const h = await api.login(email),
      result = await api.request('/dashboard', h);
    expect(result.status).toBe(200);
    expect(result.body.counts).toEqual(golden[id]);
    expect(result.body.business_date).toBe('2026-10-19');
    for (const metric of result.body.metrics) {
      const params = new URLSearchParams({ ...metric.query, page_size: '1', page: '1' });
      const list = await api.request(
        (metric.path === '/payments' ? '/obligations' : metric.path) + '?' + params,
        h,
      );
      expect(list.status).toBe(200);
      expect(list.body.total).toBe(metric.count);
      expect(list.body.items.length).toBe(Math.min(1, metric.count));
    }
    if (id === 'U002')
      expect((await api.request('/dashboard?property_id=P003', h)).status).toBe(403);
    if (id === 'U003')
      expect(
        (await api.request('/dashboard', { ...h, 'x-role': 'OWNER' })).body.counts.total_properties,
      ).toBe(1);
  }
  const h = await api.login();
  expect(
    (await api.request('/dashboard?business_date=2026-10-22', h)).body.counts.current_tenants,
  ).toBe(7);
  expect((await api.request('/dashboard?business_date=not-a-date', h)).status).toBe(400);
  expect((await api.request('/dashboard?role=OWNER', h)).status).toBe(400);
});
