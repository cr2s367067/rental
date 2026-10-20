import { test, expect } from './fixtures';
import { readFile } from 'node:fs/promises';
async function signIn(page: import('@playwright/test').Page, email: string) {
  await page.goto('/');
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(process.env.DEMO_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
}
test('Manager first-contract form rolls back invalid assignment, saves contact, edits/terminates and transfers document bytes', async ({
  page,
}) => {
  await signIn(page, 'manager@example.test');
  await page.getByRole('link', { name: 'Contracts', exact: true }).click();
  await page.getByRole('button', { name: 'Add contract', exact: true }).click();
  await page.getByLabel('Tenant selection', { exact: true }).selectOption('new');
  await page.getByLabel('New tenant name', { exact: true }).fill('Browser first contact');
  await page.getByLabel('Resource', { exact: true }).selectOption('R104');
  await page.getByLabel('Start date', { exact: true }).fill('2026-10-19');
  await page.getByLabel('End date', { exact: true }).fill('2027-10-19');
  await page.getByLabel('Monthly rent TWD', { exact: true }).fill('10000');
  await page.getByLabel('Deposit TWD', { exact: true }).fill('20000');
  await page.getByRole('button', { name: 'Save contract', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('capacity');
  await expect(page.getByLabel('New tenant name', { exact: true })).toHaveValue(
    'Browser first contact',
  );
  await page.getByLabel('Resource', { exact: true }).selectOption('R202');
  await page.getByRole('button', { name: 'Save contract', exact: true }).click();
  await page
    .getByRole('link', { name: 'Open contract for Browser first contact', exact: true })
    .click();
  await expect(page.getByRole('heading', { name: 'Contract details', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Edit contract', exact: true }).click();
  await page.getByLabel('Monthly rent TWD', { exact: true }).fill('11000');
  await page.getByRole('button', { name: 'Save contract', exact: true }).click();
  await expect(page.getByText('TWD 11,000', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Upload documents', exact: true }).click();
  await page.getByRole('button', { name: 'Upload file', exact: true }).click();
  const bytes = Buffer.from('SYNTHETIC BROWSER CONTRACT\n台灣\n');
  await page
    .getByLabel('File', { exact: true })
    .setInputFiles({ name: 'browser-contract.txt', mimeType: 'text/plain', buffer: bytes });
  await page.getByRole('button', { name: 'Save document', exact: true }).click();
  const row = page.getByRole('row').filter({ hasText: 'browser-contract.txt' });
  await expect(row).toBeVisible();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    row.getByRole('button', { name: 'Download', exact: true }).click(),
  ]);
  expect(await readFile((await download.path())!)).toEqual(bytes);
  await page.getByRole('link', { name: 'Contracts', exact: true }).click();
  await page
    .getByRole('link', { name: 'Open contract for Browser first contact', exact: true })
    .click();
  await page.getByRole('button', { name: 'Terminate contract', exact: true }).click();
  await page.getByLabel('Termination date', { exact: true }).fill('2026-10-19');
  await page.getByRole('button', { name: 'Save termination', exact: true }).click();
  await expect(page.getByText('Terminated', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Resources', exact: true }).click();
  await expect(page.getByRole('row').filter({ hasText: 'Room 202' })).toContainText('Available');
});
test('Viewer document metadata remains visible while content and writes are denied', async ({
  page,
}) => {
  await signIn(page, 'viewer@example.test');
  await page.getByRole('link', { name: 'Documents', exact: true }).click();
  await expect(page.getByText('DEMO-CONTRACT-C001.txt', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Upload file', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Download', exact: true })).toHaveCount(0);
  expect((await page.request.get('/api/documents/DOC-C001/content')).status()).toBe(403);
});
