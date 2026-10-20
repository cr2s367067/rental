import { isDeepStrictEqual } from 'node:util';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const origin = 'http://localhost:5173';
const expected = JSON.parse(
  readFileSync('specs/001-property-management/mock-data/expected-results.json', 'utf8'),
).dashboard_by_user;
const fixture = JSON.parse(
  readFileSync('specs/001-property-management/mock-data/fixtures.json', 'utf8'),
);
const results = [];
for (const [role, id] of [
  ['owner', 'U001'],
  ['manager', 'U002'],
  ['viewer', 'U003'],
] as const) {
  const login = await fetch(origin + '/api/session', {
    method: 'POST',
    headers: { origin, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: role + '@example.test', password: process.env.DEMO_PASSWORD }),
  });
  if (!login.ok) throw Error(role + ' container login failed ' + login.status);
  const session = (await login.json()) as { csrf_token: string; business_date: string };
  const headers = {
    cookie: login.headers.get('set-cookie')!.split(';')[0],
    origin,
    'x-csrf-token': session.csrf_token,
  };
  const dashboard = await fetch(origin + '/api/dashboard', { headers });
  const body = (await dashboard.json()) as { counts: unknown };
  if (dashboard.status !== 200 || !isDeepStrictEqual(body.counts, expected[id]))
    throw Error(role + ' container golden mismatch');
  if (session.business_date !== '2026-10-19') throw Error('Wrong demo date');
  const doc = await fetch(origin + '/api/documents/DOC-C001/content', { headers });
  if (doc.status !== (role === 'viewer' ? 403 : 200))
    throw Error(role + ' document permission mismatch ' + doc.status);
  let digest: string | undefined;
  if (doc.ok)
    digest = createHash('sha256')
      .update(new Uint8Array(await doc.arrayBuffer()))
      .digest('hex');
  if (
    doc.ok &&
    digest !== fixture.documents.find((d: { id: string }) => d.id === 'DOC-C001').sha256
  )
    throw Error('Container document bytes differ');
  const logout = await fetch(origin + '/api/session', { method: 'DELETE', headers });
  if (!logout.ok) throw Error('Container logout failed');
  results.push({
    role,
    dashboard: dashboard.status,
    counts: body.counts,
    document: doc.status,
    sha256: digest,
    logout: logout.status,
  });
}
if (!(await fetch(origin)).ok) throw Error('Frontend unavailable');
console.log(JSON.stringify({ timestamp: new Date().toISOString(), url: origin, results }, null, 2));
