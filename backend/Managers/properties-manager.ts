import { selectResources } from './selection-rules';
import { Injectable, ConflictException, ForbiddenException } from '@nestjs/common';
import { Database, locks } from '../Src/Infrastructure/database';
import { Access, Actor } from '../Src/Infrastructure/access';
import { SessionManager } from './session-manager';
import { RecordsManager } from './records-manager';
import { exists, invalid, version, paginate } from '../Src/Infrastructure/rules';
import { assertCapacity } from './contract-rules';
import type {
  CreatePropertyInput,
  UpdatePropertyInput,
  CreateResourceInput,
  UpdateResourceInput,
} from '../Src/Contracts/property.contract';
import { ListQuery } from '../Src/Contracts/common.contract';
function text(value: string, label: string) {
  if (!value.trim()) invalid('Enter ' + label);
  return value.trim();
}
@Injectable()
export class PropertiesManager {
  constructor(
    private db: Database,
    private access: Access,
    private sessions: SessionManager,
    private records: RecordsManager,
  ) {}
  async list(actor: Actor, query: ListQuery) {
    const data = await this.records.dataset(actor, query);
    return paginate(data.properties, query, data.business_date);
  }
  async get(actor: Actor, id: string, query: ListQuery) {
    const data = await this.records.dataset(actor, { ...query, property_id: id });
    return exists(data.properties.find((p) => p.id === id) || null, 'Property');
  }
  async resources(actor: Actor, query: ListQuery) {
    const data = await this.records.dataset(actor, query);
    if (query.resource_id) {
      const raw = await this.db.resource.findUnique({ where: { id: query.resource_id } });
      if (raw) this.access.property(await this.access.current(actor), raw.property_id);
    }
    return paginate(selectResources(data, query), query, data.business_date);
  }
  async create(actor: Actor, input: CreatePropertyInput) {
    const property = await this.db.$transaction(async (tx) => {
      await locks(tx, ['administration']);
      this.access.owner(await this.access.current(actor, tx));
      const owner = exists(
        await tx.user.findUnique({ where: { id: input.owner_user_id } }),
        'Owner',
      );
      if (!owner.enabled || owner.role !== 'OWNER') invalid('Select an enabled Owner');
      return tx.property.create({
        data: {
          ...input,
          name: text(input.name, 'property name'),
          city: text(input.city, 'city'),
          address: text(input.address, 'address'),
        },
      });
    });
    return this.get(actor, property.id, new ListQuery());
  }
  async update(actor: Actor, id: string, input: UpdatePropertyInput) {
    await this.db.$transaction(async (tx) => {
      await locks(tx, ['administration']);
      const fresh = await this.access.current(actor, tx);
      this.access.write(fresh);
      this.access.property(fresh, id);
      const record = exists(await tx.property.findUnique({ where: { id } }), 'Property');
      version(record, input.version);
      if (
        fresh.role !== 'OWNER' &&
        (input.owner_user_id !== undefined || input.rental_mode !== undefined)
      )
        throw new ForbiddenException('Only Owner can change ownership or rental mode');
      if (input.owner_user_id) {
        const owner = exists(
          await tx.user.findUnique({ where: { id: input.owner_user_id } }),
          'Owner',
        );
        if (!owner.enabled || owner.role !== 'OWNER') invalid('Select an enabled Owner');
      }
      if (
        input.rental_mode &&
        input.rental_mode !== record.rental_mode &&
        (await tx.resource.count({ where: { property_id: id } }))
      )
        throw new ConflictException(
          'Rental mode must match existing resource kinds; change it before adding resources',
        );
      const { version: _, ...fields } = input;
      await tx.property.update({
        where: { id },
        data: {
          ...fields,
          ...(fields.name !== undefined ? { name: text(fields.name, 'property name') } : {}),
          ...(fields.city !== undefined ? { city: text(fields.city, 'city') } : {}),
          ...(fields.address !== undefined ? { address: text(fields.address, 'address') } : {}),
          version: { increment: 1 },
        },
      });
    });
    return this.get(actor, id, new ListQuery());
  }
  async createResource(actor: Actor, id: string, input: CreateResourceInput) {
    const resource = await this.db.$transaction(async (tx) => {
      await locks(tx, ['administration', 'property:' + id]);
      const fresh = await this.access.current(actor, tx);
      this.access.write(fresh);
      this.access.property(fresh, id);
      const property = exists(await tx.property.findUnique({ where: { id } }), 'Property');
      const kind = property.rental_mode === 'ROOMS' ? 'ROOM' : 'WHOLE_PROPERTY';
      if (input.kind !== kind) invalid('Resource kind must match the property rental mode');
      if (kind === 'WHOLE_PROPERTY' && (await tx.resource.count({ where: { property_id: id } })))
        throw new ConflictException('A whole-property rental has one resource');
      if (!Number.isInteger(input.capacity) || input.capacity < 1 || input.capacity > 1000)
        invalid('Capacity must be a positive integer up to 1000');
      return tx.resource.create({
        data: { ...input, property_id: id, name: text(input.name, 'resource name') },
      });
    });
    return exists(
      (await this.records.dataset(actor, new ListQuery())).resources.find(
        (r) => r.id === resource.id,
      ) || null,
    );
  }
  async updateResource(actor: Actor, id: string, input: UpdateResourceInput) {
    const property_id = await this.db.$transaction(async (tx) => {
      await locks(tx, ['resource:' + id]);
      const resource = exists(await tx.resource.findUnique({ where: { id } }), 'Resource');
      const fresh = await this.access.current(actor, tx);
      this.access.write(fresh);
      this.access.property(fresh, resource.property_id);
      version(resource, input.version);
      const capacity = input.capacity ?? resource.capacity;
      if (!Number.isInteger(capacity) || capacity < 1 || capacity > 1000)
        invalid('Capacity must be a positive integer up to 1000');
      assertCapacity(
        await tx.contract.findMany({ where: { resource_id: id } }),
        capacity,
        await this.sessions.date(tx),
      );
      await tx.resource.update({
        where: { id },
        data: {
          capacity,
          ...(input.name !== undefined ? { name: text(input.name, 'resource name') } : {}),
          version: { increment: 1 },
        },
      });
      return resource.property_id;
    });
    return exists(
      (
        await this.records.dataset(actor, Object.assign(new ListQuery(), { property_id }))
      ).resources.find((r) => r.id === id) || null,
    );
  }
}
