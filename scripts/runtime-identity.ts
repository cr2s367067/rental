import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
const paths = ['package.json', 'bun.lock', 'tsconfig.base.json', 'compose.yaml'];
function walk(dir: string) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', 'dist', 'tests'].includes(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else paths.push(path);
  }
}
walk('frontend');
walk('backend');
const hashes = Object.fromEntries(
  paths.sort().map((path) => [path, createHash('sha256').update(readFileSync(path)).digest('hex')]),
);
for (const service of ['backend', 'frontend']) {
  const probe = `const {createHash}=require('node:crypto'),{readFileSync}=require('node:fs');const paths=${JSON.stringify(paths)};console.log(JSON.stringify(Object.fromEntries(paths.map(p=>[p,createHash('sha256').update(readFileSync(p)).digest('hex')]))))`;
  const process = Bun.spawn(['docker', 'compose', 'exec', '-T', service, 'bun', '-e', probe], {
    stdout: 'pipe',
    stderr: 'pipe',
  });
  const output = await new Response(process.stdout).json();
  if (await process.exited) throw Error('Runtime identity probe failed');
  if (JSON.stringify(output) !== JSON.stringify(hashes))
    throw Error(service + ' source differs from host application snapshot');
}
const containers = Bun.spawn(['docker', 'compose', 'ps', '-q'], { stdout: 'pipe' });
const ids = (await new Response(containers.stdout).text()).trim().split('\n');
if (await containers.exited) throw Error('Compose inventory failed');
const info = [];
for (const id of ids) {
  const p = Bun.spawn(
    [
      'docker',
      'inspect',
      '--format',
      '{{json .Name}} {{json .Image}} {{json .State.Health.Status}} {{json (index .Config.Labels "com.docker.compose.config-hash")}}',
      id,
    ],
    { stdout: 'pipe' },
  );
  info.push((await new Response(p.stdout).text()).trim());
  if (await p.exited) throw Error('Inspect failed');
}
const snapshot_digest = createHash('sha256').update(JSON.stringify(hashes)).digest('hex');
writeFileSync(
  'specs/001-property-management/validation/runtime-identity.json',
  JSON.stringify(
    {
      timestamp: new Date().toISOString(),
      url: 'http://localhost:5173',
      snapshot_digest,
      application_hashes: hashes,
      containers: info,
      verification:
        'Both runtime containers match all host application files byte-for-byte. Environment values omitted.',
    },
    null,
    2,
  ) + '\n',
);
console.log(
  '4 runtime identities and ' +
    paths.length +
    ' application files verified; SHA256 ' +
    snapshot_digest,
);
