import { beforeAll, beforeEach, afterAll, test, expect } from 'bun:test';
import { httpServer } from '../http';
let api: Awaited<ReturnType<typeof httpServer>>;
beforeAll(async () => {
  api = await httpServer();
});
beforeEach(async () => api.reset());
afterAll(async () => api.close());
test('contract HTTP XOR/nested validation, scoped atomic creation, versions and termination', async () => {
  const manager = await api.login('manager@example.test');
  const body = {
    resource_id: 'R202',
    new_tenant: { name: 'HTTP atomic' },
    start_date: '2026-10-19',
    end_date: '2027-10-19',
    monthly_rent_twd: '10000',
    deposit_twd: '20000',
    due_day: 1,
  };
  expect(
    (await api.request('/contracts', manager, 'POST', { ...body, tenant_id: 'TEN001' })).status,
  ).toBe(400);
  expect(
    (await api.request('/contracts', manager, 'POST', { ...body, new_tenant: undefined })).status,
  ).toBe(400);
  expect(
    (
      await api.request('/contracts', manager, 'POST', {
        ...body,
        new_tenant: { name: 'Invalid', role: 'OWNER' },
      })
    ).status,
  ).toBe(400);
  expect((await api.request('/contracts/C004', manager)).status).toBe(403);
  const created = await api.request('/contracts', manager, 'POST', body);
  expect(created.status).toBe(201);
  expect(created.body.tenant_name).toBe('HTTP atomic');
  const id = created.body.id;
  expect(
    (
      await api.request('/contracts/' + id, manager, 'PATCH', {
        version: 1,
        end_date: '2027-11-01',
      })
    ).status,
  ).toBe(200);
  expect(
    (await api.request('/contracts/' + id, manager, 'PATCH', { version: 1, due_day: 2 })).status,
  ).toBe(409);
  expect(
    (
      await api.request('/contracts/' + id + '/termination', manager, 'POST', {
        version: 2,
        termination_date: '2026-10-19',
      })
    ).body.status,
  ).toBe('Terminated');
  const viewer = await api.login('viewer@example.test');
  expect(
    (await api.request('/contracts', viewer, 'POST', { ...body, resource_id: 'R103' })).status,
  ).toBe(403);
  expect((await api.request('/contracts/C001', viewer)).status).toBe(200);
});
test('multipart uploads enforce contents/limits/relationship scope and download unchanged bytes', async () => {
  const owner = await api.login();
  async function upload(bytes: Uint8Array, mime = 'text/plain', contract = 'C001') {
    const form = new FormData();
    form.set('kind', 'CONTRACT');
    form.set('property_id', 'P001');
    form.set('contract_id', contract);
    form.set('file', new Blob([bytes as BlobPart], { type: mime }), 'uploaded.txt');
    const { 'Content-Type': _, ...headers } = owner;
    return fetch(api.base + '/documents', { method: 'POST', headers, body: form });
  }
  const bytes = Buffer.from('HTTP synthetic upload\n台灣\n');
  const saved = await upload(bytes);
  expect(saved.status).toBe(201);
  const doc = (await saved.json()) as { id: string };
  const downloaded = await fetch(api.base + '/documents/' + doc.id + '/content', {
    headers: owner,
  });
  expect(downloaded.status).toBe(200);
  expect(Buffer.from(await downloaded.arrayBuffer())).toEqual(bytes);
  expect(downloaded.headers.get('content-disposition')).toContain('uploaded.txt');
  expect((await upload(Buffer.from('not PDF'), 'application/pdf')).status).toBe(415);
  expect((await upload(Buffer.alloc(10485761, 65))).status).toBe(413);
  expect((await upload(bytes, 'text/plain', 'C004')).status).toBe(422);
  const viewer = await api.login('viewer@example.test');
  expect((await api.request('/documents', viewer)).body.total).toBe(8);
  const denied = await fetch(api.base + '/documents/' + doc.id + '/content', { headers: viewer });
  expect(denied.status).toBe(403);
  expect(await denied.text()).not.toContain('HTTP synthetic upload');
});
