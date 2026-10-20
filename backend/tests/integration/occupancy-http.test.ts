import { beforeAll, beforeEach, afterAll, test, expect } from 'bun:test';
import { httpServer } from '../http';
let api: Awaited<ReturnType<typeof httpServer>>;
beforeAll(async () => {
  api = await httpServer();
});
beforeEach(async () => api.reset());
afterAll(async () => api.close());
test('persisted occupancy, exclusive end and concurrent capacity edits preserve shared room', async () => {
  const h = await api.login();
  const r = await api.request('/stays', h);
  expect(r.status).toBe(200);
  expect(r.body.items.filter((s: any) => s.status === 'Current').length).toBe(6);
  const later = await api.request('/resources?business_date=2026-10-24', h);
  expect(later.body.items.find((s: any) => s.id === 'R104').current_count).toBe(1);
  const denied = await api.request('/resources/R104', h, 'PATCH', { version: 1, capacity: 1 });
  expect(denied.status).toBe(409);
  const results = await Promise.all([
    api.request('/resources/R104', h, 'PATCH', { version: 1, capacity: 3 }),
    api.request('/resources/R104', h, 'PATCH', { version: 1, capacity: 2 }),
  ]);
  expect(results.map((r) => r.status).sort()).toEqual([200, 409]);
  const after = await api.request('/resources?resource_id=R104', h);
  expect(after.body.items[0].current_count).toBe(2);
  expect(after.body.items[0].capacity).toBeGreaterThanOrEqual(2);
  expect(
    (await api.request('/stays', h, 'POST', { tenant_id: 'TEN001', actual_arrival: '2026-10-19' }))
      .status,
  ).toBe(404);
});
