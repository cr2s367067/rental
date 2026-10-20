import { selectTenants } from './selection-rules';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { Database, locks, type Tx } from '../Src/Infrastructure/database';
import { Access, Actor } from '../Src/Infrastructure/access';
import { RecordsManager } from './records-manager';
import { exists, version, paginate } from '../Src/Infrastructure/rules';
import { tenantContact } from './tenant-rules';
import type { CreateTenantInput, UpdateTenantInput } from '../Src/Contracts/stay.contract';
import { ListQuery } from '../Src/Contracts/common.contract';
@Injectable()
export class TenantsManager {
  constructor(
    private db: Database,
    private access: Access,
    private records: RecordsManager,
  ) {}
  async visible(actor: Actor, id: string, tx: Tx = this.db) {
    const tenant = exists(await tx.tenant.findUnique({ where: { id } }), 'Tenant');
    if (
      actor.role !== 'OWNER' &&
      !(await tx.contract.findFirst({
        where: { tenant_id: id, resource: { property_id: { in: actor.property_ids } } },
      }))
    )
      throw new ForbiddenException('Tenant access denied');
    return tenant;
  }
  async list(actor: Actor, query: ListQuery) {
    if (query.tenant_id) await this.visible(await this.access.current(actor), query.tenant_id);
    const data = await this.records.dataset(actor, query);
    return paginate(selectTenants(data, query), query, data.business_date);
  }
  async get(actor: Actor, id: string, query: ListQuery) {
    await this.visible(await this.access.current(actor), id);
    const data = await this.records.dataset(actor, query);
    return exists(data.tenants.find((t) => t.id === id) || null, 'Tenant');
  }
  async create(actor: Actor, input: CreateTenantInput) {
    const row = await this.db.$transaction(async (tx) => {
      this.access.owner(await this.access.current(actor, tx));
      return tx.tenant.create({ data: tenantContact(input) });
    });
    return this.get(actor, row.id, new ListQuery());
  }
  async update(actor: Actor, id: string, input: UpdateTenantInput) {
    await this.db.$transaction(async (tx) => {
      await locks(tx, ['tenant:' + id]);
      const fresh = await this.access.current(actor, tx);
      this.access.write(fresh);
      const record = await this.visible(fresh, id, tx);
      version(record, input.version);
      const data = tenantContact({
        name: input.name ?? record.name,
        email: input.email === undefined ? record.email : input.email,
        phone: input.phone === undefined ? record.phone : input.phone,
      });
      await tx.tenant.update({ where: { id }, data: { ...data, version: { increment: 1 } } });
    });
    return this.get(actor, id, new ListQuery());
  }
}
