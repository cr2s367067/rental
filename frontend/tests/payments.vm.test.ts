import { test, expect } from 'bun:test';
import { PaymentsVM } from '../VMs/payments.vm';
import { paymentsService, type PaymentsService } from '../Services/payments.service';
const payment = {
  id: 'PAY1',
  obligation_id: 'O1',
  amount_twd: '1000',
  kind: 'PAYMENT' as const,
  reverses_payment_id: null,
  reversal_id: null,
  recorded_at: '2026-10-19T00:00:00Z',
};
test('payment intent key is stable through the request and duplicate pending clicks do not send twice', async () => {
  let finish!: (p: typeof payment) => void,
    calls = 0,
    refresh = 0;
  const service: PaymentsService = {
    ...paymentsService,
    record: async (id, body, key) => {
      calls++;
      expect(key).toBe('intent-fixed');
      return new Promise((resolve) => {
        finish = resolve;
      });
    },
  };
  const vm = new PaymentsVM(
    service,
    async () => {
      refresh++;
    },
    () => 'intent-fixed',
  );
  const key = vm.newIntent();
  const first = vm.record('O1', { amount_twd: '1000' }, key);
  const second = vm.record('O1', { amount_twd: '1000' }, key);
  expect(calls).toBe(1);
  finish(payment);
  await Promise.all([first, second]);
  expect(refresh).toBe(1);
  expect(vm.pending).toBe(false);
});
test('overpayment conflict retains input and correction failure remains actionable', async () => {
  const input = { amount_twd: '11001' };
  const vm = new PaymentsVM(
    {
      ...paymentsService,
      record: async () => {
        throw { message: 'Payment exceeds outstanding TWD' };
      },
    },
    async () => {},
  );
  await vm.record('O1', input, vm.newIntent());
  expect(vm.error).toContain('outstanding');
  expect(input.amount_twd).toBe('11001');
});
