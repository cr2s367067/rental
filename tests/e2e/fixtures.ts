import { test as base, expect } from '@playwright/test';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execute = promisify(execFile);
export const test = base.extend<{ baseline: void }>({
  baseline: [
    async ({}, use) => {
      await execute('bun', ['scripts/reset-e2e.ts'], { env: process.env, timeout: 30000 });
      await use(undefined);
    },
    { auto: true },
  ],
});
export { expect };
