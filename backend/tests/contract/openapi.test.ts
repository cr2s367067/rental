import { test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
const schema = Bun.YAML.parse(readFileSync('backend/OpenAPI/openapi.yaml', 'utf8')) as Record<
  string,
  any
>;
test('OpenAPI documents anonymous login and cookie plus CSRF security for authenticated mutations', () => {
  expect(schema.openapi).toBe('3.0.0');
  expect(schema.paths['/api/session'].post.security).toEqual([]);
  expect(schema.components.securitySchemes.csrf).toMatchObject({
    type: 'apiKey',
    in: 'header',
    name: 'X-CSRF-Token',
  });
  for (const [path, operations] of Object.entries(schema.paths)) {
    for (const [method, op] of Object.entries(operations as Record<string, any>)) {
      if (
        ['post', 'patch', 'put', 'delete'].includes(method) &&
        !(path === '/api/session' && method === 'post')
      )
        expect(op.security.some((s: Record<string, unknown>) => 'cookie' in s && 'csrf' in s)).toBe(
          true,
        );
    }
  }
});
test('registered domain operations retain standard errors, payment intent headers and read-only occupancy', () => {
  const operations = Object.values(schema.paths).flatMap((p) =>
    Object.values(p as Record<string, any>),
  );
  const ids = operations.map((o: any) => o.operationId);
  expect(new Set(ids).size).toBe(ids.length);
  expect(ids).toContain('getDashboard');
  expect(ids).toContain('uploadDocument');
  expect(Object.keys(schema.paths['/api/stays'])).toEqual(['get']);
  for (const op of operations as any[]) {
    for (const code of ['400', '401', '403', '404', '409', '413', '415', '422', '429'])
      expect(op.responses[code]).toBeDefined();
    if (['recordPayment', 'reversePayment'].includes(op.operationId))
      expect(
        op.parameters.some(
          (p: any) => p.in === 'header' && p.name === 'Idempotency-Key' && p.required,
        ),
      ).toBe(true);
  }
});
