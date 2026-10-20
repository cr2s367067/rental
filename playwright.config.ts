import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/e2e',
  workers: 1,
  retries: 0,
  timeout: 30000,
  use: { baseURL: 'http://localhost:5174', channel: 'chrome', headless: true, trace: 'off' },
  webServer: [
    {
      command: 'bun scripts/e2e-backend.ts',
      url: 'http://localhost:3101/api/health',
      reuseExistingServer: false,
    },
    {
      command: 'API_PROXY=http://127.0.0.1:3101 bun run --filter frontend dev --port 5174',
      url: 'http://localhost:5174',
      reuseExistingServer: false,
    },
  ],
  reporter: [['list']],
});
