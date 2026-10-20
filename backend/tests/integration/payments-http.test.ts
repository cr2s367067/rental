import { beforeAll, beforeEach, afterAll, test, expect } from 'bun:test';
import { httpServer } from '../http';
let api: Awaited<ReturnType<typeof httpServer>>;
beforeAll(async () => {
  api = await httpServer();
});
beforeEach(async () => api.reset());
afterAll(async () => api.close());
test('scoped exact billing HTTP supports explicit periods, safe retries and append-only corrections', async () => {
  const owner = await api.login();
  const baseline = await api.request('/obligations', owner);
  expect(baseline.body.total).toBe(9);
  expect(baseline.body.items.find((o: any) => o.id === 'OBL003')).toMatchObject({
    status: 'Overdue',
    is_partial: true,
    amount_paid_twd: '9000',
    outstanding_twd: '9000',
  });
  const outstanding = await api.request('/obligations?metric=unpaid_rent_periods', owner);
  expect(outstanding.body.total).toBe(5);
  expect(
    outstanding.body.items.reduce((n: bigint, o: any) => n + BigInt(o.outstanding_twd), 0n),
  ).toBe(74000n);
  const period = {
    period_start: '2026-11-01',
    period_end: '2026-11-12',
    due_date: '2026-11-04',
    amount_due_twd: '4321',
    entry_mode: 'MANUAL_PARTIAL_PERIOD',
  };
  expect((await api.request('/contracts/C001/obligations', owner, 'POST', period)).status).toBe(
    201,
  );
  expect((await api.request('/contracts/C001/obligations', owner, 'POST', period)).status).toBe(
    409,
  );
  expect(
    (
      await api.request('/contracts/C001/obligations', owner, 'POST', {
        ...period,
        amount_due_twd: '0.5',
      })
    ).status,
  ).toBe(400);
  expect(
    (
      await api.request('/contracts/C001/obligations', owner, 'POST', {
        ...period,
        entry_mode: 'FULL_MONTH',
      })
    ).status,
  ).toBe(422);
  const h = { ...owner, 'Idempotency-Key': 'payment-http-key' };
  const first = await api.request('/obligations/OBL004/payments', h, 'POST', {
    amount_twd: '1000',
  });
  expect(first.status).toBe(201);
  expect(
    (await api.request('/obligations/OBL004/payments', h, 'POST', { amount_twd: '1000' })).body,
  ).toEqual(first.body);
  expect(
    (await api.request('/obligations/OBL004/payments', h, 'POST', { amount_twd: '1001' })).status,
  ).toBe(409);
  expect(
    (await api.request('/obligations/OBL004/payments', owner, 'POST', { amount_twd: '1000' }))
      .status,
  ).toBe(400);
  expect(
    (
      await api.request(
        '/obligations/OBL004/payments',
        { ...owner, 'Idempotency-Key': 'overpay-http' },
        'POST',
        { amount_twd: '10001' },
      )
    ).status,
  ).toBe(409);
  const reverse = { ...owner, 'Idempotency-Key': 'reverse-http' };
  expect(
    (
      await api.request('/payments/PAY002/reversal', reverse, 'POST', {
        replacement_amount_twd: '8000',
      })
    ).status,
  ).toBe(201);
  expect(
    (
      await api.request('/payments/PAY002/reversal', reverse, 'POST', {
        replacement_amount_twd: '7000',
      })
    ).status,
  ).toBe(409);
  expect(
    (
      await api.request(
        '/payments/PAY002/reversal',
        { ...owner, 'Idempotency-Key': 'again-http' },
        'POST',
        {},
      )
    ).status,
  ).toBe(409);
  expect(
    (
      await api.request(
        '/payments/PAY003/reversal',
        { ...owner, 'Idempotency-Key': 'bad-replacement' },
        'POST',
        { replacement_amount_twd: '20000' },
      )
    ).status,
  ).toBe(409);
  const adjusted = await api.request('/contracts/C003/obligations', owner);
  expect(adjusted.body.items[0]).toMatchObject({
    amount_paid_twd: '8000',
    outstanding_twd: '10000',
    status: 'Overdue',
  });
  expect(
    (await api.request('/contracts/C004/obligations', owner)).body.items[0].payments.find(
      (p: any) => p.id === 'PAY003',
    ).reversal_id,
  ).toBeNull();
  expect((await api.request('/payments/PAY002', owner, 'PATCH', { amount_twd: '1' })).status).toBe(
    404,
  );
  const manager = await api.login('manager@example.test');
  expect((await api.request('/obligations?property_id=P003', manager)).status).toBe(403);
  const viewer = await api.login('viewer@example.test');
  expect((await api.request('/obligations', viewer)).status).toBe(200);
  expect(
    (
      await api.request(
        '/obligations/OBL002/payments',
        { ...viewer, 'Idempotency-Key': 'viewer-http' },
        'POST',
        { amount_twd: '1' },
      )
    ).status,
  ).toBe(403);
});
