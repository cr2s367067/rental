import { beforeAll, beforeEach, afterAll, test, expect } from 'bun:test';
import { httpServer } from '../http';
let api: Awaited<ReturnType<typeof httpServer>>;
beforeAll(async () => {
  api = await httpServer();
});
beforeEach(async () => api.reset());
afterAll(async () => api.close());
test('property/resource routes persist, validate and enforce scoped role fields', async () => {
  const owner = await api.login();
  const created = await api.request('/properties', owner, 'POST', {
    name: 'API house',
    city: 'Taipei',
    address: 'Demo address',
    owner_user_id: 'U001',
    rental_mode: 'ROOMS',
  });
  expect(created.status).toBe(201);
  const id = created.body.id;
  expect((await api.request('/properties/' + id, owner)).body.name).toBe('API house');
  expect(
    (
      await api.request('/properties/' + id + '/resources', owner, 'POST', {
        name: 'Room 1',
        kind: 'ROOM',
        capacity: 1,
      })
    ).status,
  ).toBe(201);
  expect(
    (await api.request('/resources/R104', owner, 'PATCH', { version: 1, capacity: 1 })).status,
  ).toBe(409);
  expect(
    (
      await api.request('/properties', owner, 'POST', {
        name: '',
        city: '',
        address: '',
        owner_user_id: 'U001',
        rental_mode: 'ROOMS',
      })
    ).status,
  ).toBe(400);
  const manager = await api.login('manager@example.test');
  expect((await api.request('/properties/P003', manager)).status).toBe(403);
  expect(
    (await api.request('/properties/P001', manager, 'PATCH', { version: 1, owner_user_id: 'U002' }))
      .status,
  ).toBe(403);
  const viewer = await api.login('viewer@example.test');
  expect(
    (await api.request('/resources/R101', viewer, 'PATCH', { version: 1, name: 'Denied' })).status,
  ).toBe(403);
  expect((await api.request('/properties', viewer)).body.total).toBe(1);
});
