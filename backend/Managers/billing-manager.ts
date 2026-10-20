import { selectObligations } from './selection-rules';
import { Injectable, ConflictException } from '@nestjs/common';
import { Database, locks } from '../Src/Infrastructure/database';
import { Access, Actor } from '../Src/Infrastructure/access';
import { RecordsManager } from './records-manager';
import { ContractsManager } from './contracts-manager';
import {
  businessDate,
  wholeTWD,
  invalid,
  paginate,
  exists,
  dateOnly,
} from '../Src/Infrastructure/rules';
import type { CreateObligationInput, ObligationQuery } from '../Src/Contracts/payment.contract';
import { ListQuery } from '../Src/Contracts/common.contract';
@Injectable()
export class BillingManager {
  constructor(
    private db: Database,
    private access: Access,
    private records: RecordsManager,
    private contracts: ContractsManager,
  ) {}
  async list(actor: Actor, query: ObligationQuery) {
    if (query.contract_id)
      await this.contracts.visible(await this.access.current(actor), query.contract_id);
    const data = await this.records.dataset(actor, query);
    return paginate(selectObligations(data, query), query, data.business_date);
  }
  async create(actor: Actor, contract_id: string, input: CreateObligationInput) {
    const id = await this.db.$transaction(async (tx) => {
      const initial = await this.contracts.visible(
        await this.access.current(actor, tx),
        contract_id,
        tx,
      );
      await locks(tx, ['resource:' + initial.resource_id]);
      const fresh = await this.access.current(actor, tx);
      this.access.write(fresh);
      const contract = await this.contracts.visible(fresh, contract_id, tx);
      if (contract.resource_id !== initial.resource_id)
        throw new ConflictException('Assignment changed. Refresh before creating an obligation');
      const period_start = businessDate(input.period_start),
        period_end = businessDate(input.period_end),
        due_date = businessDate(input.due_date);
      if (period_start >= period_end) invalid('Period start must be before its exclusive end');
      wholeTWD(input.amount_due_twd);
      if (input.entry_mode === 'FULL_MONTH') {
        const next = new Date(period_start);
        next.setUTCMonth(next.getUTCMonth() + 1);
        if (period_start.getUTCDate() !== 1 || dateOnly(next) !== input.period_end)
          invalid('Full-month periods start on day 1 and end on day 1 of the next month');
      }
      // Explicit values are authoritative: no historical generation, proration or rewriting due dates.
      return (
        await tx.rentalObligation.create({
          data: {
            contract_id,
            period_start,
            period_end,
            due_date,
            amount_due_twd: input.amount_due_twd,
            entry_mode: input.entry_mode,
          },
        })
      ).id;
    });
    const data = await this.records.dataset(actor, new ListQuery());
    return exists(data.obligations.find((o) => o.id === id) || null, 'Obligation');
  }
}
