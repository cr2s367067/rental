import { test, expect, beforeAll, beforeEach, afterAll } from 'bun:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { httpServer } from '../http';
import { db, password } from '../fixtures';
import { domain } from '../domain';
import { DemoFixtures } from '../../Src/Infrastructure/demo-fixtures';
import type { Config } from '../../Src/Infrastructure/config';
const f = JSON.parse(readFileSync('specs/001-property-management/mock-data/fixtures.json', 'utf8'));
const golden = JSON.parse(
  readFileSync('specs/001-property-management/mock-data/expected-results.json', 'utf8'),
).dashboard_by_user;
const d = domain();
let api: Awaited<ReturnType<typeof httpServer>>;
beforeAll(async () => {
  api = await httpServer();
});
beforeEach(async () => {
  await api.reset();
});
afterAll(async () => {
  await api.close();
  await d.close();
});
function loader(overrides: Record<string, unknown> = {}) {
  return new DemoFixtures(
    d.db,
    {
      ...d.config,
      demo: true,
      databaseURL: process.env.DATABASE_URL!.replace('/rental_demo', '/rental_demo_test'),
      isolated: true,
      demoDatabase: 'rental_demo_test',
      environment: 'test',
      ...overrides,
    } as Config,
    d.store,
  );
}
test('explicit loader reimports twice: stable IDs, hashes, credential verification and durable seeded request replay', async () => {
  const old = await d.access.login('owner@example.test', password);
  for (let i = 0; i < 2; i++) {
    expect(await loader().run()).toEqual({ ok: true });
    expect(await db.property.count()).toBe(4);
    expect(await db.resource.count()).toBe(11);
    expect(await db.tenant.count()).toBe(10);
    expect(await db.contract.count()).toBe(9);
    expect(await db.rentalObligation.count()).toBe(9);
    expect(await db.paymentRecord.count()).toBe(6);
    expect(await db.document.count()).toBe(15);
    expect(await db.user.count()).toBe(3);
    expect(await db.idempotencyRecord.count()).toBe(6);
    expect(
      (await db.contract.findMany({ select: { id: true }, orderBy: { id: 'asc' } })).map(
        (r) => r.id,
      ),
    ).toEqual(f.contracts.map((r: { id: string }) => r.id).sort());
    for (const doc of await db.document.findMany({ include: { content: true } }))
      expect(createHash('sha256').update(doc.content!.bytes).digest('hex')).toBe(doc.sha256);
    const user = await db.user.findUniqueOrThrow({ where: { id: 'U001' } });
    expect(user.password_hash).not.toBe(password);
    expect(await Bun.password.verify(password, user.password_hash)).toBe(true);
  }
  await expect(d.access.authenticate(old.id)).rejects.toThrow('Session expired');
  const headers = await api.login();
  const payment = f.payments[0];
  const replay = await api.request(
    '/obligations/' + payment.obligation_id + '/payments',
    { ...headers, 'idempotency-key': payment.request_key },
    'POST',
    { amount_twd: payment.amount_twd },
  );
  expect(replay.status).toBe(201);
  expect(replay.body.id).toBe(payment.id);
  expect(await db.paymentRecord.count()).toBe(6);
  expect(
    (
      await api.request(
        '/obligations/' + payment.obligation_id + '/payments',
        { ...headers, 'idempotency-key': payment.request_key },
        'POST',
        { amount_twd: '1' },
      )
    ).status,
  ).toBe(409);
});
test('Owner reset restores all role golden API counts and invalidates every previous session', async () => {
  const headers = await api.login();
  const manager = await api.login('manager@example.test');
  await api.request('/demo/context', headers, 'PATCH', { business_date: '2026-11-01' });
  expect((await api.request('/demo/reset', headers, 'POST')).status).toBe(201);
  expect((await api.request('/session', headers)).status).toBe(401);
  expect((await api.request('/session', manager)).status).toBe(401);
  for (const [email, id] of [
    ['owner', 'U001'],
    ['manager', 'U002'],
    ['viewer', 'U003'],
  ] as const) {
    const h = await api.login(email + '@example.test');
    const dashboard = await api.request('/dashboard', h);
    expect(dashboard.status).toBe(200);
    expect(dashboard.body.counts).toEqual(golden[id]);
    expect((await api.request('/demo/context', h)).body.business_date).toBe('2026-10-19');
  }
});
test('Manager/Viewer reset denied; unsafe environments refuse before mutating durable records', async () => {
  for (const role of ['manager', 'viewer'])
    expect(
      (await api.request('/demo/reset', await api.login(role + '@example.test'), 'POST')).status,
    ).toBe(403);
  for (const overrides of [
    { demo: false },
    { isolated: false },
    { environment: 'production' },
    { demoDatabase: 'unrelated' },
    { databaseURL: 'postgresql://rental@localhost/unrelated' },
  ])
    await expect(loader(overrides).run()).rejects.toThrow('isolated demo');
  expect(await db.paymentRecord.count()).toBe(6);
  expect(await db.property.count()).toBe(4);
});
