import { billingState, paymentView } from './payment-rules';
import { dateOnly } from '../Src/Infrastructure/rules';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Database } from '../Src/Infrastructure/database';
import { Access, Actor } from '../Src/Infrastructure/access';
import { SessionManager } from './session-manager';
import type { ListQuery } from '../Src/Contracts/common.contract';
import { current, occupancyStatus, effectiveEnd, classify } from './contract-rules';
@Injectable()
export class RecordsManager {
  constructor(
    private db: Database,
    private access: Access,
    private sessions: SessionManager,
  ) {}
  async dataset(actor: Actor, query: ListQuery) {
    return this.db.$transaction(
      async (tx) => {
        actor = await this.access.current(actor, tx);
        if (query.property_id) this.access.property(actor, query.property_id);
        const business_date = query.business_date || (await this.sessions.date(tx));
        const rows = await tx.property.findMany({
          where: {
            ...(actor.role === 'OWNER' ? {} : { id: { in: actor.property_ids } }),
            ...(query.property_id ? { id: query.property_id } : {}),
          },
          include: {
            owner: { select: { display_name: true } },
            resources: {
              include: { contracts: { include: { tenant: true }, orderBy: { id: 'asc' } } },
              orderBy: { id: 'asc' },
            },
          },
          orderBy: { id: 'asc' },
        });
        const resources = rows.flatMap((p) =>
          p.resources.map((r) => {
            const active = r.contracts.filter((c) => current(c, business_date));
            return {
              id: r.id,
              property_id: p.id,
              property_name: p.name,
              name: r.name,
              kind: r.kind,
              capacity: r.capacity,
              version: r.version,
              current_count: active.length,
              available_slots: r.capacity - active.length,
              available: active.length === 0,
              occupants: active.map((c) => ({
                contract_id: c.id,
                tenant_id: c.tenant_id,
                tenant_name: c.tenant.name,
              })),
            };
          }),
        );
        const properties = rows.map((p) => ({
          id: p.id,
          name: p.name,
          city: p.city,
          address: p.address,
          owner_user_id: p.owner_user_id,
          owner_name: p.owner.display_name,
          rental_mode: p.rental_mode,
          version: p.version,
          resources: resources.filter((r) => r.property_id === p.id),
        }));
        const contracts = rows.flatMap((p) =>
          p.resources.flatMap((r) =>
            r.contracts.map((c) => ({
              ...c,
              resource_name: r.name,
              property_id: p.id,
              property_name: p.name,
            })),
          ),
        );
        const stays = contracts.map((c) => ({
          id: c.id,
          contract_id: c.id,
          tenant_id: c.tenant_id,
          tenant_name: c.tenant.name,
          resource_id: c.resource_id,
          resource_name: c.resource_name,
          property_id: c.property_id,
          property_name: c.property_name,
          start_date: dateOnly(c.start_date),
          end_date: dateOnly(c.end_date),
          effective_end_date: dateOnly(effectiveEnd(c)),
          termination_date: c.termination_date ? dateOnly(c.termination_date) : null,
          status: occupancyStatus(c, business_date),
        }));
        const tenantRows = await tx.tenant.findMany({
          where:
            actor.role === 'OWNER' && !query.property_id
              ? {}
              : { id: { in: contracts.map((c) => c.tenant_id) } },
          select: { id: true, name: true, email: true, phone: true, version: true },
          orderBy: { id: 'asc' },
        });
        const tenants = tenantRows.map((t) => ({
          ...t,
          contracts: stays.filter((s) => s.tenant_id === t.id),
        }));
        const contract_views = contracts.map((c) => {
          const { status, ...base } = stays.find((s) => s.id === c.id)!;
          return {
            ...base,
            status: classify(c, business_date),
            monthly_rent_twd: c.monthly_rent_twd.toFixed(0),
            deposit_twd: c.deposit_twd.toFixed(0),
            due_day: c.due_day,
            primary_document_id: c.primary_document_id,
            version: c.version,
          };
        });
        const obligationRows = await tx.rentalObligation.findMany({
          where: { contract_id: { in: contracts.map((c) => c.id) } },
          include: { payments: { orderBy: [{ recorded_at: 'asc' }, { id: 'asc' }] } },
          orderBy: { id: 'asc' },
        });
        const obligations = obligationRows.map((o) => {
          const c = contract_views.find((c) => c.id === o.contract_id)!;
          const payments = o.payments.map((p) =>
            paymentView(p, o.payments.find((r) => r.reverses_payment_id === p.id)?.id || null),
          );
          const amount_due_twd = o.amount_due_twd.toFixed(0);
          return {
            id: o.id,
            contract_id: o.contract_id,
            tenant_id: c.tenant_id,
            tenant_name: c.tenant_name,
            resource_id: c.resource_id,
            resource_name: c.resource_name,
            property_id: c.property_id,
            property_name: c.property_name,
            period_start: dateOnly(o.period_start),
            period_end: dateOnly(o.period_end),
            due_date: dateOnly(o.due_date),
            entry_mode: o.entry_mode,
            amount_due_twd,
            ...billingState(amount_due_twd, payments, dateOnly(o.due_date), business_date),
            payments,
          };
        });
        return {
          business_date,
          properties,
          resources,
          contracts,
          stays,
          tenants,
          contract_views,
          obligations,
          document_metadata_count: await tx.document.count({
            where: { property_id: { in: rows.map((p) => p.id) } },
          }),
        };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
  }
}
