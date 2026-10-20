import { fixtures, db, testDatabaseURL } from '../backend/tests/fixtures';
import { spawn } from 'bun';
await fixtures();
await db.$disconnect();
const child = spawn(['bun', 'backend/dist/Src/main.js'], {
  env: {
    ...process.env,
    DATABASE_URL: testDatabaseURL,
    PORT: '3101',
    APP_ORIGIN: 'http://localhost:5174',
    DEMO_MODE: 'true',
    NODE_ENV: 'test',
    DEMO_ISOLATED: 'true',
    DEMO_DATABASE: 'rental_demo_test',
  },
  stdout: 'inherit',
  stderr: 'inherit',
});
for (const signal of ['SIGTERM', 'SIGINT'] as const) process.on(signal, () => child.kill(signal));
await child.exited;
