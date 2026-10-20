import { BadRequestException, ConflictException } from '@nestjs/common';
import { createHash } from 'node:crypto';
import type { PaymentRecord } from '@prisma/client';
import type { PaymentView } from '../Src/Contracts/payment.contract';
import { wholeTWD } from '../Src/Infrastructure/rules';
export function paymentView(row: PaymentRecord, reversal_id: string | null = null): PaymentView {
  return {
    id: row.id,
    obligation_id: row.obligation_id,
    amount_twd: row.amount_twd.toFixed(0),
    kind: row.kind,
    reverses_payment_id: row.reverses_payment_id,
    reversal_id,
    recorded_at: row.recorded_at.toISOString(),
  };
}
export function billingState(
  amount_due_twd: string,
  payments: Pick<PaymentView, 'kind' | 'amount_twd'>[],
  due_date: string,
  business_date: string,
) {
  const due = wholeTWD(amount_due_twd);
  const paid = payments.reduce(
    (sum, p) => sum + (p.kind === 'REVERSAL' ? -1n : 1n) * wholeTWD(p.amount_twd, true),
    0n,
  );
  const balance = due - paid;
  if (paid < 0n || balance < 0n)
    throw new ConflictException('Payment records would produce an invalid balance');
  const status: 'Paid' | 'Overdue' | 'Partial Payment' | 'Unpaid' =
    balance === 0n
      ? 'Paid'
      : business_date > due_date
        ? 'Overdue'
        : paid > 0n
          ? 'Partial Payment'
          : 'Unpaid';
  return {
    amount_paid_twd: paid.toString(),
    outstanding_twd: balance.toString(),
    status,
    is_partial: paid > 0n && balance > 0n,
  };
}
export function requestKey(key: string) {
  if (typeof key !== 'string' || !/^[-A-Za-z0-9._:]{1,128}$/.test(key))
    throw new BadRequestException(
      'Supply a valid Idempotency-Key (1–128 letters, digits or . _ : -)',
    );
  return key;
}
export function paymentRequestHash(
  operation: string,
  target: string,
  payload: Record<string, string | null>,
) {
  return createHash('sha256').update(JSON.stringify({ operation, target, payload })).digest('hex');
}
