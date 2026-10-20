import { test, expect, beforeAll, beforeEach, afterAll } from 'bun:test';
import { httpServer } from '../http';
let api: Awaited<ReturnType<typeof httpServer>>;
beforeAll(async () => {
  api = await httpServer();
});
beforeEach(async () => api.reset());
afterAll(async () => api.close());
test('nonnullable optional PATCH fields reject null without mutation; documented nullable links/contacts remain allowed', async () => {
  const owner = await api.login();
  for (const [path, fields] of [
    ['/properties/P001', ['name', 'city', 'address', 'owner_user_id', 'rental_mode']],
    ['/resources/R202', ['name', 'capacity']],
    ['/tenants/TEN001', ['name']],
    [
      '/contracts/C001',
      [
        'resource_id',
        'tenant_id',
        'start_date',
        'end_date',
        'monthly_rent_twd',
        'deposit_twd',
        'due_day',
      ],
    ],
    ['/users/U002', ['email', 'display_name', 'role', 'enabled']],
  ] as const) {
    for (const field of fields) {
      const result = await api.request(path, owner, 'PATCH', { version: 1, [field]: null });
      expect(result.status).toBe(400);
    }
  }
  expect(
    (
      await api.request(
        '/payments/PAY002/reversal',
        { ...owner, 'Idempotency-Key': 'invalid-null' },
        'POST',
        { replacement_amount_twd: null },
      )
    ).status,
  ).toBe(400);
  expect((await api.request('/properties/P001', owner)).body.version).toBe(1);
  expect((await api.request('/resources?resource_id=R202', owner)).body.items[0].version).toBe(1);
  expect(
    (await api.request('/tenants/TEN001', owner, 'PATCH', { version: 1, email: null, phone: null }))
      .status,
  ).toBe(200);
  expect(
    (
      await api.request('/contracts/C001', owner, 'PATCH', {
        version: 1,
        primary_document_id: null,
      })
    ).status,
  ).toBe(200);
});
test('whitespace-only account names fail before creating or changing a user', async () => {
  const owner = await api.login();
  expect(
    (
      await api.request('/users', owner, 'POST', {
        email: 'blank@example.test',
        display_name: '   ',
        role: 'VIEWER',
        enabled: true,
        password: process.env.DEMO_PASSWORD,
      })
    ).status,
  ).toBe(400);
  expect(
    (await api.request('/users/U002', owner, 'PATCH', { version: 1, display_name: '   ' })).status,
  ).toBe(400);
  expect((await api.request('/users', owner)).body.total).toBe(3);
});
