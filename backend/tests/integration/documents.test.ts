import { test, expect, beforeEach, afterAll } from 'bun:test';
import { fixtures } from '../fixtures';
import { domain } from '../domain';
import { DocumentsManager } from '../../Managers/documents-manager';
import { ListQuery } from '../../Src/Contracts/common.contract';
import { createHash } from 'node:crypto';
const d = domain(),
  m = new DocumentsManager(d.db, d.access, d.sessions);
beforeEach(fixtures);
afterAll(d.close);
test('metadata/BYTEA save atomically, associated primary contract and exact retrieval survive reopen', async () => {
  const actor = await d.access.actor('U002');
  const bytes = Buffer.from('Synthetic uploaded contract\n台灣測試\n');
  const row = await m.upload(
    actor,
    { kind: 'CONTRACT', property_id: 'P001', contract_id: 'C001' },
    { bytes, mime_type: 'text/plain', file_name: 'demo-contract.txt' },
  );
  expect(row.size_bytes).toBe(bytes.length);
  expect(row.sha256).toBe(createHash('sha256').update(bytes).digest('hex'));
  const downloaded = await m.download(actor, row.id);
  expect(Buffer.from(downloaded.bytes)).toEqual(bytes);
  const list = await m.list(actor, new ListQuery());
  expect(JSON.stringify(list)).not.toContain('Synthetic uploaded contract');
  expect(
    list.items.every(
      (row: object) => !Object.hasOwn(row, 'bytes') && !Object.hasOwn(row, 'content'),
    ),
  ).toBe(true);
});
test('all baseline document contents have exact SHA256; Viewer sees metadata only', async () => {
  const owner = await d.access.actor('U001');
  const list = await m.list(owner, new ListQuery());
  expect(list.total).toBe(15);
  for (const row of list.items) {
    const content = await m.download(owner, row.id);
    expect(createHash('sha256').update(content.bytes).digest('hex')).toBe(row.sha256);
  }
  const viewer = await d.access.actor('U003');
  expect((await m.list(viewer, new ListQuery())).total).toBe(7);
  await expect(m.download(viewer, 'DOC-C001')).rejects.toThrow();
  await expect(m.download(await d.access.actor('U002'), 'DOC-C004')).rejects.toThrow();
});
test('invalid/oversized/spoofed/inconsistent uploads preserve metadata and contents', async () => {
  const owner = await d.access.actor('U001');
  const before = await d.db.document.count();
  for (const file of [
    { bytes: Buffer.from('not PDF'), mime_type: 'application/pdf', file_name: 'bad.pdf' },
    { bytes: Buffer.alloc(10485761, 65), mime_type: 'text/plain', file_name: 'large.txt' },
    { bytes: Buffer.from('bad'), mime_type: 'application/x-executable', file_name: 'bad.exe' },
    { bytes: Buffer.from('safe'), mime_type: 'text/plain', file_name: '../bad.txt' },
  ])
    await expect(
      m.upload(owner, { kind: 'PROPERTY', property_id: 'P001' }, file),
    ).rejects.toThrow();
  await expect(
    m.upload(
      owner,
      { kind: 'CONTRACT', property_id: 'P001', contract_id: 'C004' },
      { bytes: Buffer.from('text'), mime_type: 'text/plain', file_name: 'bad.txt' },
    ),
  ).rejects.toThrow();
  expect(await d.db.document.count()).toBe(before);
  expect(await d.db.documentContent.count()).toBe(before);
});
test('approved PNG/JPEG/PDF and exact 10MiB text are accepted; spoofed image headers fail', async () => {
  const owner = await d.access.actor('U001');
  for (const [file_name, mime_type] of [
    ['sample.png', 'image/png'],
    ['sample.jpg', 'image/jpeg'],
  ] as const) {
    const bytes = new Uint8Array(await Bun.file('backend/tests/assets/' + file_name).arrayBuffer());
    const row = await m.upload(
      owner,
      { kind: 'PROPERTY', property_id: 'P001' },
      { bytes, mime_type, file_name },
    );
    expect(row.size_bytes).toBe(bytes.length);
  }
  const pdf = Buffer.from('%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\ntrailer\n%%EOF\n');
  expect(
    (
      await m.upload(
        owner,
        { kind: 'PROPERTY', property_id: 'P001' },
        { bytes: pdf, mime_type: 'application/pdf', file_name: 'synthetic.pdf' },
      )
    ).mime_type,
  ).toBe('application/pdf');
  const max = Buffer.alloc(10485760, 65);
  expect(
    (
      await m.upload(
        owner,
        { kind: 'PROPERTY', property_id: 'P001' },
        { bytes: max, mime_type: 'text/plain', file_name: 'max.txt' },
      )
    ).size_bytes,
  ).toBe(10485760);
  await expect(
    m.upload(
      owner,
      { kind: 'PROPERTY', property_id: 'P001' },
      {
        bytes: Buffer.from('89504e470d0a1a0a', 'hex'),
        mime_type: 'image/png',
        file_name: 'spoof.png',
      },
    ),
  ).rejects.toThrow();
});
test('late PostgreSQL content insertion failure rolls back document metadata', async () => {
  const before = await d.db.document.count();
  await d.db.$executeRawUnsafe(
    `CREATE OR REPLACE FUNCTION reject_test_content() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'isolated content failure'; END; $$`,
  );
  await d.db.$executeRawUnsafe(
    `CREATE TRIGGER reject_test_content BEFORE INSERT ON "DocumentContent" FOR EACH ROW EXECUTE FUNCTION reject_test_content()`,
  );
  try {
    await expect(
      m.upload(
        await d.access.actor('U001'),
        { kind: 'PROPERTY', property_id: 'P001' },
        {
          bytes: Buffer.from('late transaction failure'),
          mime_type: 'text/plain',
          file_name: 'failure.txt',
        },
      ),
    ).rejects.toThrow();
    expect(await d.db.document.count()).toBe(before);
  } finally {
    await d.db.$executeRawUnsafe(`DROP TRIGGER reject_test_content ON "DocumentContent"`);
    await d.db.$executeRawUnsafe(`DROP FUNCTION reject_test_content()`);
  }
});
