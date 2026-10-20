import { test, expect, beforeEach, afterAll } from 'bun:test';
import { fixtures } from '../fixtures';
import { domain } from '../domain';
import { PaymentsManager } from '../../Managers/payments-manager';
const d = domain(),
  m = new PaymentsManager(d.db, d.access, d.sessions);
beforeEach(fixtures);
afterAll(d.close);
test('identical requests replay original result; changed payload conflicts without extra payment', async () => {
  const a = await d.access.actor('U001');
  const first = await m.record(a, 'OBL004', { amount_twd: '1000' }, 'payment-retry');
  expect(await m.record(a, 'OBL004', { amount_twd: '1000' }, 'payment-retry')).toEqual(first);
  await expect(m.record(a, 'OBL004', { amount_twd: '1001' }, 'payment-retry')).rejects.toThrow();
  expect(await d.db.paymentRecord.count({ where: { obligation_id: 'OBL004' } })).toBe(2);
  expect(await d.db.idempotencyRecord.count({ where: { request_key: 'payment-retry' } })).toBe(1);
});
test('overpayment and concurrent payments preserve nonnegative exact outstanding', async () => {
  const a = await d.access.actor('U001');
  const before = await d.db.paymentRecord.count();
  await expect(m.record(a, 'OBL004', { amount_twd: '11001' }, 'overpay')).rejects.toThrow();
  expect(await d.db.paymentRecord.count()).toBe(before);
  const results = await Promise.allSettled([
    m.record(a, 'OBL004', { amount_twd: '11000' }, 'pay-a'),
    m.record(a, 'OBL004', { amount_twd: '11000' }, 'pay-b'),
  ]);
  expect(results.filter((r) => r.status === 'fulfilled').length).toBe(1);
  const paid = await d.db.paymentRecord.findMany({ where: { obligation_id: 'OBL004' } });
  expect(paid.reduce((n, p) => n + BigInt(p.amount_twd.toFixed(0)), 0n)).toBe(16000n);
});
test('append-only reversal plus optional replacement is single and idempotent', async () => {
  const a = await d.access.actor('U001');
  const original = await d.db.paymentRecord.findUniqueOrThrow({ where: { id: 'PAY002' } });
  const result = await m.reverse(a, 'PAY002', { replacement_amount_twd: '8000' }, 'reverse-key');
  expect(result.reversal.reverses_payment_id).toBe('PAY002');
  expect(result.replacement!.amount_twd).toBe('8000');
  expect(await m.reverse(a, 'PAY002', { replacement_amount_twd: '8000' }, 'reverse-key')).toEqual(
    result,
  );
  await expect(m.reverse(a, 'PAY002', {}, 'second-reverse')).rejects.toThrow();
  expect(
    (await d.db.paymentRecord.findUniqueOrThrow({ where: { id: 'PAY002' } })).amount_twd.toFixed(0),
  ).toBe(original.amount_twd.toFixed(0));
  expect(await d.db.paymentRecord.count({ where: { reverses_payment_id: 'PAY002' } })).toBe(1);
});
test('same-key concurrent calls return one durable result and Viewer/outscope writes fail', async () => {
  const a = await d.access.actor('U001');
  const [first, second] = await Promise.all([
    m.record(a, 'OBL004', { amount_twd: '1000' }, 'parallel-key'),
    m.record(a, 'OBL004', { amount_twd: '1000' }, 'parallel-key'),
  ]);
  expect(second).toEqual(first);
  await expect(
    m.record(await d.access.actor('U003'), 'OBL002', { amount_twd: '1' }, 'viewer'),
  ).rejects.toThrow();
  await expect(
    m.record(await d.access.actor('U002'), 'OBL004', { amount_twd: '1' }, 'outscope'),
  ).rejects.toThrow();
});
test('late idempotency persistence failure rolls back payment and balance', async () => {
  const a = await d.access.actor('U001');
  const count = await d.db.paymentRecord.count();
  await d.db.$executeRawUnsafe(
    `CREATE FUNCTION reject_test_idempotency() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'isolated ledger failure'; END; $$`,
  );
  await d.db.$executeRawUnsafe(
    `CREATE TRIGGER reject_test_idempotency BEFORE INSERT ON "IdempotencyRecord" FOR EACH ROW EXECUTE FUNCTION reject_test_idempotency()`,
  );
  try {
    await expect(m.record(a, 'OBL004', { amount_twd: '1000' }, 'failure-key')).rejects.toThrow();
    expect(await d.db.paymentRecord.count()).toBe(count);
  } finally {
    await d.db.$executeRawUnsafe(`DROP TRIGGER reject_test_idempotency ON "IdempotencyRecord"`);
    await d.db.$executeRawUnsafe(`DROP FUNCTION reject_test_idempotency()`);
  }
});
