import { createApplication, schema } from './bootstrap';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
async function main() {
  const app = await createApplication();
  const dir = join(__dirname, '../../OpenAPI');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'openapi.json'), JSON.stringify(schema(app), null, 2) + '\n');
  await app.close();
}
void main();
