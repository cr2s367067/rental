import { selectContracts } from './selection-rules';
import { Injectable, ConflictException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Database, locks, type Tx } from '../Src/Infrastructure/database';
import { Access, Actor } from '../Src/Infrastructure/access';
import {
  exists,
  version,
  invalid,
  paginate,
  businessDate,
  wholeTWD,
  dateOnly,
} from '../Src/Infrastructure/rules';
import { RecordsManager } from './records-manager';
import { SessionManager } from './session-manager';
import { TenantsManager } from './tenants-manager';
import { tenantContact } from './tenant-rules';
import { assertCapacity, effectiveEnd, type Term } from './contract-rules';
import type {
  CreateContractInput,
  UpdateContractInput,
  TerminationInput,
} from '../Src/Contracts/contract.contract';
import { ListQuery } from '../Src/Contracts/common.contract';
@Injectable()
export class ContractsManager {
  constructor(
    private db: Database,
    private access: Access,
    private records: RecordsManager,
    private sessions: SessionManager,
    private tenants: TenantsManager,
  ) {}
  async visible(actor: Actor, id: string, tx: Tx = this.db) {
    const contract = exists(
      await tx.contract.findUnique({ where: { id }, include: { resource: true } }),
      'Contract',
    );
    this.access.property(actor, contract.resource.property_id);
    return contract;
  }
  async list(actor: Actor, query: ListQuery) {
    const data = await this.records.dataset(actor, query);
    return paginate(selectContracts(data, query), query, data.business_date);
  }
  async get(actor: Actor, id: string, query: ListQuery) {
    await this.visible(await this.access.current(actor), id);
    const data = await this.records.dataset(actor, query);
    return exists(data.contract_views.find((c) => c.id === id) || null, 'Contract');
  }
  private terms(input: {
    start_date: string;
    end_date: string;
    monthly_rent_twd: string;
    deposit_twd: string;
    due_day: number;
  }) {
    const start_date = businessDate(input.start_date),
      end_date = businessDate(input.end_date);
    if (start_date >= end_date) invalid('Contract start must be before its exclusive end');
    wholeTWD(input.monthly_rent_twd);
    wholeTWD(input.deposit_twd);
    if (!Number.isInteger(input.due_day) || input.due_day < 1 || input.due_day > 28)
      invalid('Due day must be from 1 through 28');
    return {
      start_date,
      end_date,
      monthly_rent_twd: input.monthly_rent_twd,
      deposit_twd: input.deposit_twd,
      due_day: input.due_day,
    };
  }
  private async capacity(tx: Tx, resource_id: string, candidate: Term, capacity: number) {
    const terms = await tx.contract.findMany({ where: { resource_id, id: { not: candidate.id } } });
    const end = effectiveEnd(candidate);
    if (
      candidate.start_date < end &&
      terms.some(
        (t) =>
          t.tenant_id === candidate.tenant_id &&
          t.start_date < end &&
          candidate.start_date < effectiveEnd(t) &&
          t.start_date < effectiveEnd(t),
      )
    )
      throw new ConflictException(
        'This tenant already has an overlapping contract on this resource',
      );
    assertCapacity([...terms, candidate], capacity, await this.sessions.date(tx));
  }
  private async document(
    tx: Tx,
    id: string | null | undefined,
    contract_id: string,
    tenant_id: string,
    property_id: string,
  ) {
    if (!id) return;
    const doc = exists(await tx.document.findUnique({ where: { id } }), 'Document');
    if (
      doc.contract_id !== contract_id ||
      doc.tenant_id !== tenant_id ||
      doc.property_id !== property_id
    )
      invalid('Primary document must belong to this contract, tenant and property');
  }
  async create(actor: Actor, input: CreateContractInput) {
    const id = await this.db.$transaction(async (tx) => {
      await locks(tx, ['resource:' + input.resource_id]);
      const fresh = await this.access.current(actor, tx);
      this.access.write(fresh);
      const resource = exists(
        await tx.resource.findUnique({ where: { id: input.resource_id } }),
        'Resource',
      );
      this.access.property(fresh, resource.property_id);
      if (!!input.tenant_id === !!input.new_tenant)
        invalid('Choose exactly one existing tenant or new contact');
      const tenant_id = input.tenant_id || randomUUID();
      if (input.tenant_id) await this.tenants.visible(fresh, tenant_id, tx);
      const terms = this.terms(input),
        id = randomUUID();
      await this.capacity(
        tx,
        resource.id,
        { id, tenant_id, ...terms, termination_date: null },
        resource.capacity,
      );
      await this.document(tx, input.primary_document_id, id, tenant_id, resource.property_id);
      if (input.new_tenant)
        await tx.tenant.create({ data: { id: tenant_id, ...tenantContact(input.new_tenant) } });
      await tx.contract.create({
        data: {
          id,
          tenant_id,
          resource_id: resource.id,
          ...terms,
          primary_document_id: input.primary_document_id || null,
        },
      });
      return id;
    });
    return this.get(actor, id, new ListQuery());
  }
  async update(actor: Actor, id: string, input: UpdateContractInput) {
    await this.db.$transaction(async (tx) => {
      const initial = exists(await tx.contract.findUnique({ where: { id } }), 'Contract');
      await locks(tx, [
        'resource:' + initial.resource_id,
        'resource:' + (input.resource_id || initial.resource_id),
      ]);
      const fresh = await this.access.current(actor, tx);
      this.access.write(fresh);
      const record = await this.visible(fresh, id, tx);
      version(record, input.version);
      if (record.resource_id !== initial.resource_id)
        throw new ConflictException('Contract assignment changed. Refresh before saving');
      const resource = exists(
        await tx.resource.findUnique({ where: { id: input.resource_id || record.resource_id } }),
        'Resource',
      );
      this.access.property(fresh, resource.property_id);
      const tenant_id = input.tenant_id || record.tenant_id;
      await this.tenants.visible(fresh, tenant_id, tx);
      const terms = this.terms({
        start_date: input.start_date || dateOnly(record.start_date),
        end_date: input.end_date || dateOnly(record.end_date),
        monthly_rent_twd: input.monthly_rent_twd ?? record.monthly_rent_twd.toFixed(0),
        deposit_twd: input.deposit_twd ?? record.deposit_twd.toFixed(0),
        due_day: input.due_day ?? record.due_day,
      });
      if (record.termination_date && record.termination_date > terms.end_date)
        invalid('Termination cannot be after the ordinary contract end');
      await this.capacity(
        tx,
        resource.id,
        { id, tenant_id, ...terms, termination_date: record.termination_date },
        resource.capacity,
      );
      await tx.document.updateMany({
        where: { contract_id: id },
        data: { property_id: resource.property_id, tenant_id },
      });
      const primary_document_id =
        input.primary_document_id === undefined
          ? record.primary_document_id
          : input.primary_document_id;
      await this.document(tx, primary_document_id, id, tenant_id, resource.property_id);
      await tx.contract.update({
        where: { id },
        data: {
          ...terms,
          tenant_id,
          resource_id: resource.id,
          primary_document_id,
          version: { increment: 1 },
        },
      });
    });
    return this.get(actor, id, new ListQuery());
  }
  async terminate(actor: Actor, id: string, input: TerminationInput) {
    await this.db.$transaction(async (tx) => {
      const initial = exists(await tx.contract.findUnique({ where: { id } }), 'Contract');
      await locks(tx, ['resource:' + initial.resource_id]);
      const fresh = await this.access.current(actor, tx);
      this.access.write(fresh);
      const record = await this.visible(fresh, id, tx);
      version(record, input.version);
      if (record.resource_id !== initial.resource_id)
        throw new ConflictException('Assignment changed. Refresh before saving');
      const termination_date = businessDate(input.termination_date);
      if (termination_date > record.end_date)
        invalid('Termination cannot be after the ordinary contract end');
      await this.capacity(
        tx,
        record.resource_id,
        { ...record, termination_date },
        record.resource.capacity,
      );
      await tx.contract.update({
        where: { id },
        data: { termination_date, version: { increment: 1 } },
      });
    });
    return this.get(actor, id, new ListQuery());
  }
}
