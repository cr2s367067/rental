import { httpServer } from '../backend/tests/http';
import { db } from '../backend/tests/fixtures';
const api = await httpServer();
const results: { role: string; action: string; ms: number; status: number }[] = [];
try {
  await api.reset();
  await Promise.all(
    ['owner', 'manager', 'viewer'].map(async (role) => {
      const headers = await api.login(role + '@example.test');
      const property = role === 'owner' ? 'P003' : 'P001';
      for (const [action, path, method, body] of [
        ['list', '/properties', 'GET', undefined],
        ['detail', '/properties/' + property, 'GET', undefined],
        ...(role === 'viewer'
          ? [['metadata', '/documents', 'GET', undefined]]
          : role === 'owner'
            ? [['save', '/properties/P003', 'PATCH', { version: 1, city: 'Timing smoke' }]]
            : [['save', '/resources/R202', 'PATCH', { version: 1, name: 'Timing smoke' }]]),
      ] as [string, string, string, unknown][]) {
        const start = performance.now();
        const res = await api.request(path, headers, method, body);
        const ms = Math.round((performance.now() - start) * 100) / 100;
        results.push({ role, action, ms, status: res.status });
        if (res.status !== 200 || ms >= 2000)
          throw new Error(`${role} ${action} failed timing/status`);
      }
    }),
  );
  console.log(
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        runtime: Bun.version,
        sessions: 3,
        threshold_ms: 2000,
        results,
      },
      null,
      2,
    ),
  );
} finally {
  await api.reset();
  await api.close();
  await db.$disconnect();
}
