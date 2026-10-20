import { test, expect, beforeEach, afterAll } from 'bun:test';
import { readFileSync } from 'node:fs';
import { billingState } from '../../Managers/payment-rules';
import { wholeTWD } from '../../Src/Infrastructure/rules';
import { fixtures } from '../fixtures';
import { domain } from '../domain';
import { BillingManager } from '../../Managers/billing-manager';
import { ContractsManager } from '../../Managers/contracts-manager';
import { TenantsManager } from '../../Managers/tenants-manager';
const d = domain(),
  contracts = new ContractsManager(
    d.db,
    d.access,
    d.records,
    d.sessions,
    new TenantsManager(d.db, d.access, d.records),
  ),
  billing = new BillingManager(d.db, d.access, d.records, contracts);
beforeEach(fixtures);
afterAll(d.close);
test('all nine policy payment states exactly match independent golden results', () => {
  const f = JSON.parse(
    readFileSync('specs/001-property-management/mock-data/fixtures.json', 'utf8'),
  );
  const expected = JSON.parse(
    readFileSync('specs/001-property-management/mock-data/expected-results.json', 'utf8'),
  );
  for (const o of f.obligations)
    expect(
      billingState(
        o.amount_due_twd,
        f.payments.filter((p: { obligation_id: string }) => p.obligation_id === o.id),
        o.due_date,
        '2026-10-19',
      ),
    ).toEqual(expected.obligations[o.id]);
});
test('Overdue beats partial only after due day; reversal/replacement net stays exact', () => {
  const payments = [
    { kind: 'PAYMENT' as const, amount_twd: '999999999998' },
    { kind: 'REVERSAL' as const, amount_twd: '999999999998' },
    { kind: 'PAYMENT' as const, amount_twd: '9000' },
  ];
  expect(billingState('18000', payments, '2026-10-19', '2026-10-19')).toEqual({
    amount_paid_twd: '9000',
    outstanding_twd: '9000',
    status: 'Partial Payment',
    is_partial: true,
  });
  expect(billingState('18000', payments, '2026-10-19', '2026-10-20').status).toBe('Overdue');
  for (const v of ['0.5', '-1', '1e3', '1000000000000']) expect(() => wholeTWD(v)).toThrow();
});
test('explicit manual partial obligation persists values and duplicate periods fail', async () => {
  const owner = await d.access.actor('U001');
  const input = {
    period_start: '2026-11-01',
    period_end: '2026-11-12',
    due_date: '2026-11-04',
    amount_due_twd: '4321',
    entry_mode: 'MANUAL_PARTIAL_PERIOD' as const,
  };
  const row = await billing.create(owner, 'C001', input);
  expect(row.amount_due_twd).toBe('4321');
  expect(row.due_date).toBe('2026-11-04');
  await expect(billing.create(owner, 'C001', input)).rejects.toThrow();
  expect(await d.db.rentalObligation.count({ where: { contract_id: 'C001' } })).toBe(2);
});
