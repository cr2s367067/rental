import { Injectable, ConflictException } from '@nestjs/common';
import { Database, locks } from '../Src/Infrastructure/database';
import { Access, Actor } from '../Src/Infrastructure/access';
import { SessionManager } from './session-manager';
import { exists, invalid, paginate } from '../Src/Infrastructure/rules';
import { validatedFile } from './document-rules';
import type { UploadDocumentInput, DocumentQuery } from '../Src/Contracts/document.contract';
import type { ListQuery } from '../Src/Contracts/common.contract';
export interface FileUpload {
  bytes: Uint8Array;
  mime_type: string;
  file_name: string;
}
const metadata = {
  id: true,
  kind: true,
  contract_id: true,
  payment_id: true,
  tenant_id: true,
  property_id: true,
  file_name: true,
  file_type: true,
  mime_type: true,
  size_bytes: true,
  uploaded_at: true,
  sha256: true,
} as const;
@Injectable()
export class DocumentsManager {
  constructor(
    private db: Database,
    private access: Access,
    private sessions: SessionManager,
  ) {}
  async list(actor: Actor, query: DocumentQuery) {
    actor = await this.access.current(actor);
    if (query.property_id) this.access.property(actor, query.property_id);
    const where = {
      ...(actor.role === 'OWNER' ? {} : { property_id: { in: actor.property_ids } }),
      ...(query.property_id ? { property_id: query.property_id } : {}),
      ...(query.tenant_id ? { tenant_id: query.tenant_id } : {}),
      ...(query.contract_id ? { contract_id: query.contract_id } : {}),
      ...(query.payment_id ? { payment_id: query.payment_id } : {}),
    };
    const rows = await this.db.document.findMany({
      where,
      select: metadata,
      orderBy: { id: 'asc' },
    });
    return paginate(
      rows.map((r) => ({ ...r, uploaded_at: r.uploaded_at.toISOString() })),
      query,
      query.business_date || (await this.sessions.date()),
    );
  }
  async upload(actor: Actor, input: Omit<UploadDocumentInput, 'file'>, file: FileUpload) {
    const fresh = await this.access.current(actor);
    this.access.write(fresh);
    this.access.property(fresh, input.property_id);
    const content = validatedFile(file);
    const row = await this.db.$transaction(async (tx) => {
      let contract_id = input.contract_id,
        tenant_id = input.tenant_id;
      if (input.payment_id) {
        const payment = exists(
          await tx.paymentRecord.findUnique({
            where: { id: input.payment_id },
            include: { obligation: { include: { contract: true } } },
          }),
          'Payment',
        );
        const linked = payment.obligation.contract;
        if (contract_id && contract_id !== linked.id) invalid('Payment and contract must match');
        contract_id = linked.id;
      }
      if (contract_id) {
        const initial = exists(
          await tx.contract.findUnique({ where: { id: contract_id } }),
          'Contract',
        );
        await locks(tx, ['resource:' + initial.resource_id]);
        const contract = exists(
          await tx.contract.findUnique({ where: { id: contract_id }, include: { resource: true } }),
          'Contract',
        );
        if (contract.resource_id !== initial.resource_id)
          throw new ConflictException('Contract assignment changed. Refresh before upload');
        if (
          contract.resource.property_id !== input.property_id ||
          (tenant_id && tenant_id !== contract.tenant_id)
        )
          invalid('Document relationships must match the contract');
        tenant_id = contract.tenant_id;
      }
      const current = await this.access.current(actor, tx);
      this.access.write(current);
      this.access.property(current, input.property_id);
      exists(await tx.property.findUnique({ where: { id: input.property_id } }), 'Property');
      if (tenant_id) {
        exists(await tx.tenant.findUnique({ where: { id: tenant_id } }), 'Tenant');
        if (
          !(await tx.contract.findFirst({
            where: { tenant_id, resource: { property_id: input.property_id } },
          }))
        )
          invalid('Tenant must have a contract on this property');
      }
      if (input.kind === 'CONTRACT' && !contract_id)
        invalid('Contract documents require a contract');
      if (input.kind === 'RECEIPT' && !input.payment_id) invalid('Receipts require a payment');
      if (input.kind === 'TENANT' && !tenant_id) invalid('Tenant documents require a tenant');
      const { bytes, ...fileMetadata } = content;
      const doc = await tx.document.create({
        data: {
          kind: input.kind,
          property_id: input.property_id,
          contract_id: contract_id || null,
          tenant_id: tenant_id || null,
          payment_id: input.payment_id || null,
          ...fileMetadata,
          content: { create: { bytes } },
        },
        select: metadata,
      });
      if (input.kind === 'CONTRACT' && contract_id)
        await tx.contract.updateMany({
          where: { id: contract_id, primary_document_id: null },
          data: { primary_document_id: doc.id, version: { increment: 1 } },
        });
      return doc;
    });
    return { ...row, uploaded_at: row.uploaded_at.toISOString() };
  }
  async download(actor: Actor, id: string) {
    actor = await this.access.current(actor);
    this.access.write(actor);
    const doc = exists(
      await this.db.document.findUnique({ where: { id }, select: metadata }),
      'Document',
    );
    this.access.property(actor, doc.property_id);
    const content = exists(
      await this.db.documentContent.findUnique({ where: { document_id: id } }),
      'Document content',
    );
    return { ...doc, bytes: content.bytes };
  }
}
