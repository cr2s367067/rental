import { test, expect } from 'bun:test';
import { PrismaClient } from '@prisma/client';
import { mkdtemp, chmod, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { fixtures, db, testDatabaseURL } from '../fixtures';
const docker = ['docker', 'compose', 'exec', '-T', 'postgres'];
async function command(args: string[], env = process.env, stdin?: ReturnType<typeof Bun.file>) {
  const child = Bun.spawn(args, { env, stdin: stdin || 'ignore', stdout: 'pipe', stderr: 'pipe' });
  const [output, errors, exit] = await Promise.all([
    new Response(child.stdout).arrayBuffer(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (exit !== 0)
    throw new Error(
      'Recovery command failed: ' + args.slice(0, 3).join(' ') + ' (exit ' + exit + ')',
    );
  void errors;
  return new Uint8Array(output);
}
async function snapshot(client: PrismaClient) {
  const counts = await Promise.all([
    client.user.count(),
    client.property.count(),
    client.resource.count(),
    client.tenant.count(),
    client.contract.count(),
    client.rentalObligation.count(),
    client.paymentRecord.count(),
    client.document.count(),
    client.idempotencyRecord.count(),
  ]);
  const documents = (
    await client.document.findMany({ include: { content: true }, orderBy: { id: 'asc' } })
  ).map((d) => ({
    id: d.id,
    contract: d.contract_id,
    payment: d.payment_id,
    tenant: d.tenant_id,
    property: d.property_id,
    size: d.content!.bytes.length,
    sha: createHash('sha256').update(d.content!.bytes).digest('hex'),
    expected: d.sha256,
  }));
  return { counts, documents };
}
test('fresh migrations, one isolated backup/restore and explicit reimport recover relationships and BYTEA', async () => {
  if (new URL(testDatabaseURL).pathname !== '/rental_demo_test')
    throw Error('Isolated source required');
  const name = 'rental_demo_test_restore_' + process.pid + '_' + Date.now().toString(36);
  const url = new URL(testDatabaseURL);
  url.pathname = '/' + name;
  const restored = new PrismaClient({ datasources: { db: { url: url.toString() } } });
  const folder = await mkdtemp(join(tmpdir(), 'rental-recovery-'));
  await chmod(folder, 0o700);
  try {
    await fixtures();
    const before = await snapshot(db);
    await command([...docker, 'createdb', '-U', 'rental', name]);
    await command(
      ['bunx', 'prisma', 'migrate', 'deploy', '--schema', 'backend/prisma/schema.prisma'],
      { ...process.env, DATABASE_URL: url.toString() },
    );
    expect(await restored.property.count()).toBe(0);
    const dump = await command([
      ...docker,
      'pg_dump',
      '-U',
      'rental',
      '-d',
      'rental_demo_test',
      '-Fc',
    ]);
    const path = join(folder, 'isolated.dump');
    await Bun.write(path, dump);
    await chmod(path, 0o600);
    await command(
      [...docker, 'pg_restore', '-U', 'rental', '-d', name, '--clean', '--if-exists', '--no-owner'],
      process.env,
      Bun.file(path),
    );
    const after = await snapshot(restored);
    expect(after).toEqual(before);
    expect(after.documents).toHaveLength(15);
    expect(after.documents.every((d) => d.sha === d.expected)).toBe(true);
    const start = performance.now();
    await command(['bun', 'backend/prisma/seed.ts'], {
      ...process.env,
      NODE_ENV: 'test',
      DEMO_MODE: 'true',
      DEMO_ISOLATED: 'true',
      DEMO_DATABASE: 'rental_demo_test',
      DATABASE_URL: testDatabaseURL,
    });
    const ms = Math.round(performance.now() - start);
    expect(ms).toBeLessThan(300000);
    expect(await snapshot(db)).toEqual(before);
    console.log(
      JSON.stringify({
        recovery: 'PASS',
        timestamp: new Date().toISOString(),
        fresh_migrations: 2,
        counts: after.counts,
        bytea_files: after.documents.length,
        reimport_ms: ms,
        budget_ms: 300000,
      }),
    );
  } finally {
    await restored.$disconnect();
    await command([...docker, 'dropdb', '-U', 'rental', '--if-exists', name]);
    await rm(folder, { recursive: true, force: true });
    await db.$disconnect();
  }
}, 120000);
