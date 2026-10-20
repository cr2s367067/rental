import { beforeAll, beforeEach, afterAll, test, expect } from 'bun:test';
import { httpServer } from '../http';
let api: Awaited<ReturnType<typeof httpServer>>;
beforeAll(async () => {
  api = await httpServer();
});
beforeEach(async () => api.reset());
afterAll(async () => api.close());
test('registered user/ownership/date routes enforce Owner versus scoped roles', async () => {
  for (const email of ['manager@example.test', 'viewer@example.test']) {
    const h = await api.login(email);
    expect((await api.request('/users', h)).status).toBe(403);
    expect(
      (await api.request('/users/U003', h, 'PATCH', { version: 1, role: 'OWNER' })).status,
    ).toBe(403);
    expect(
      (await api.request('/properties/P001/owner', h, 'PUT', { version: 1, owner_user_id: 'U001' }))
        .status,
    ).toBe(403);
    expect(
      (await api.request('/demo/context', h, 'PATCH', { business_date: '2026-10-22' })).status,
    ).toBe(403);
    expect((await api.request('/demo/reset', h, 'POST')).status).toBe(403);
  }
  const h = await api.login();
  const users = await api.request('/users', h);
  expect(users.body.total).toBe(3);
  expect(JSON.stringify(users.body)).not.toContain('password');
  expect(
    (await api.request('/users/U001', h, 'PATCH', { version: 1, enabled: false })).status,
  ).toBe(409);
  expect(
    (await api.request('/demo/context', h, 'PATCH', { business_date: '2026-02-30' })).status,
  ).toBe(400);
  expect(
    (await api.request('/demo/context', h, 'PATCH', { business_date: '2026-10-22' })).status,
  ).toBe(200);
  expect((await api.request('/session', h)).body.business_date).toBe('2026-10-22');
});
