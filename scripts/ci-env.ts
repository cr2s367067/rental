import { existsSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
if (!process.env.CI || existsSync('.env'))
  throw Error('CI setup requires a fresh checkout without .env');
const password = randomBytes(24).toString('hex'),
  demo = randomBytes(24).toString('hex');
writeFileSync(
  '.env',
  `POSTGRES_PASSWORD=${password}\nDATABASE_URL=postgresql://rental:${password}@localhost:55432/rental_demo_test\nTEST_DATABASE_URL=postgresql://rental:${password}@localhost:55432/rental_demo_test\nREDIS_URL=redis://localhost:56379\nAPP_ORIGIN=http://localhost:5173\nDEMO_MODE=true\nDEMO_ISOLATED=true\nDEMO_DATABASE=rental_demo_test\nNODE_ENV=test\nDEMO_PASSWORD=${demo}\nPORT=3100\n`,
  { mode: 0o600 },
);
console.log('Private ephemeral CI environment configured.');
