import { Injectable, ConflictException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { Database, locks, type Tx } from '../Src/Infrastructure/database';
import { Access, Actor } from '../Src/Infrastructure/access';
import { SessionManager } from './session-manager';
import { exists, wholeTWD, dateOnly } from '../Src/Infrastructure/rules';
import { billingState, paymentView, requestKey, paymentRequestHash } from './payment-rules';
import type {
  RecordPaymentInput,
  ReversePaymentInput,
  PaymentView,
  PaymentAdjustmentView,
} from '../Src/Contracts/payment.contract';
@Injectable()
export class PaymentsManager {
  constructor(
    private db: Database,
    private access: Access,
    private sessions: SessionManager,
  ) {}
  private async obligation(tx: Tx, actor: Actor, id: string) {
    const record = exists(
      await tx.rentalObligation.findUnique({
        where: { id },
        include: { payments: true, contract: { include: { resource: true } } },
      }),
      'Obligation',
    );
    this.access.property(actor, record.contract.resource.property_id);
    return record;
  }
  private async replay(
    tx: Tx,
    principal_id: string,
    operation: string,
    request_key: string,
    request_hash: string,
  ) {
    const saved = await tx.idempotencyRecord.findUnique({
      where: { principal_id_operation_request_key: { principal_id, operation, request_key } },
    });
    if (saved && saved.request_hash !== request_hash)
      throw new ConflictException('Idempotency-Key was already used with different content');
    return saved?.response;
  }
  private async remember(
    tx: Tx,
    principal_id: string,
    operation: string,
    request_key: string,
    request_hash: string,
    response: PaymentView | PaymentAdjustmentView,
  ) {
    await tx.idempotencyRecord.create({
      data: {
        principal_id,
        operation,
        request_key,
        request_hash,
        response: JSON.parse(JSON.stringify(response)) as Prisma.InputJsonValue,
      },
    });
  }
  async record(
    actor: Actor,
    id: string,
    input: RecordPaymentInput,
    key: string,
  ): Promise<PaymentView> {
    requestKey(key);
    const amount = wholeTWD(input.amount_twd, true),
      operation = 'recordPayment',
      hash = paymentRequestHash(operation, id, { amount_twd: input.amount_twd });
    return this.db.$transaction(async (tx) => {
      await locks(tx, [
        'idempotency:' + actor.id + ':' + operation + ':' + key,
        'obligation:' + id,
      ]);
      const fresh = await this.access.current(actor, tx);
      this.access.write(fresh);
      const obligation = await this.obligation(tx, fresh, id);
      const replay = await this.replay(tx, fresh.id, operation, key, hash);
      if (replay) return replay as unknown as PaymentView;
      const state = billingState(
        obligation.amount_due_twd.toFixed(0),
        obligation.payments.map((p) => paymentView(p)),
        dateOnly(obligation.due_date),
        await this.sessions.date(tx),
      );
      if (amount > BigInt(state.outstanding_twd))
        throw new ConflictException('Payment exceeds the current outstanding TWD amount');
      const saved = await tx.paymentRecord.create({
        data: {
          obligation_id: id,
          amount_twd: input.amount_twd,
          kind: 'PAYMENT',
          request_key: key,
        },
      });
      const response = paymentView(saved);
      await this.remember(tx, fresh.id, operation, key, hash, response);
      return response;
    });
  }
  async reverse(
    actor: Actor,
    id: string,
    input: ReversePaymentInput,
    key: string,
  ): Promise<PaymentAdjustmentView> {
    requestKey(key);
    if (input.replacement_amount_twd !== undefined) wholeTWD(input.replacement_amount_twd, true);
    const operation = 'reversePayment',
      hash = paymentRequestHash(operation, id, {
        replacement_amount_twd: input.replacement_amount_twd ?? null,
      });
    return this.db.$transaction(async (tx) => {
      const initial = exists(await tx.paymentRecord.findUnique({ where: { id } }), 'Payment');
      await locks(tx, [
        'idempotency:' + actor.id + ':' + operation + ':' + key,
        'obligation:' + initial.obligation_id,
      ]);
      const fresh = await this.access.current(actor, tx);
      this.access.write(fresh);
      const obligation = await this.obligation(tx, fresh, initial.obligation_id);
      const replay = await this.replay(tx, fresh.id, operation, key, hash);
      if (replay) return replay as unknown as PaymentAdjustmentView;
      const original = exists(obligation.payments.find((p) => p.id === id) || null, 'Payment');
      if (
        original.kind !== 'PAYMENT' ||
        obligation.payments.some((p) => p.reverses_payment_id === id)
      )
        throw new ConflictException('Only an unreversed original payment can be reversed');
      const reversal = await tx.paymentRecord.create({
        data: {
          obligation_id: obligation.id,
          amount_twd: original.amount_twd,
          kind: 'REVERSAL',
          reverses_payment_id: id,
          request_key: key,
        },
      });
      let replacement: PaymentView | null = null;
      const state = billingState(
        obligation.amount_due_twd.toFixed(0),
        [...obligation.payments, reversal].map((p) => paymentView(p)),
        dateOnly(obligation.due_date),
        await this.sessions.date(tx),
      );
      if (input.replacement_amount_twd !== undefined) {
        if (wholeTWD(input.replacement_amount_twd, true) > BigInt(state.outstanding_twd))
          throw new ConflictException('Replacement exceeds the outstanding amount after reversal');
        replacement = paymentView(
          await tx.paymentRecord.create({
            data: {
              obligation_id: obligation.id,
              amount_twd: input.replacement_amount_twd,
              kind: 'PAYMENT',
              request_key: key + ':replacement',
            },
          }),
        );
      }
      const response = { reversal: paymentView(reversal), replacement };
      await this.remember(tx, fresh.id, operation, key, hash, response);
      return response;
    });
  }
}
