import { beforeAll, beforeEach, afterAll, test, expect } from 'bun:test';
import { httpServer } from '../http';
let api: Awaited<ReturnType<typeof httpServer>>;
beforeAll(async () => {
  api = await httpServer();
});
beforeEach(async () => api.reset());
afterAll(async () => api.close());
test('contact routes validate and enforce Owner standalone/Manager scoped edits/Viewer reads', async () => {
  const owner = await api.login();
  expect(
    (await api.request('/tenants', owner, 'POST', { name: 'Demo new', email: 'new@example.test' }))
      .status,
  ).toBe(201);
  expect(
    (await api.request('/tenants', owner, 'POST', { name: 'Invalid', email: 'not-email' })).status,
  ).toBe(400);
  expect(
    (await api.request('/tenants', owner, 'POST', { name: 'Manual', actual_arrival: '2026-10-19' }))
      .status,
  ).toBe(400);
  const manager = await api.login('manager@example.test');
  expect((await api.request('/tenants/TEN010', manager)).status).toBe(403);
  expect((await api.request('/tenants', manager, 'POST', { name: 'Orphan' })).status).toBe(403);
  expect(
    (await api.request('/tenants/TEN001', manager, 'PATCH', { version: 1, name: 'Scoped edit' }))
      .status,
  ).toBe(200);
  const viewer = await api.login('viewer@example.test');
  expect((await api.request('/tenants/TEN001', viewer)).body.name).toBe('Scoped edit');
  expect((await api.request('/tenants/TEN004', viewer)).status).toBe(403);
  expect(
    (await api.request('/tenants/TEN001', viewer, 'PATCH', { version: 2, name: 'Denied' })).status,
  ).toBe(403);
});
