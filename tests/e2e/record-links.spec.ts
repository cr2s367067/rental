import { test, expect } from './fixtures';
test('property → scoped contracts → tenant history → associated files retains record context', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByLabel('Email', { exact: true }).fill('owner@example.test');
  await page.getByLabel('Password', { exact: true }).fill(process.env.DEMO_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByRole('link', { name: 'Properties', exact: true }).click();
  await page.getByRole('link', { name: 'Demo Taipei House', exact: true }).click();
  await page.getByRole('link', { name: 'Contracts for property', exact: true }).click();
  await expect(page.getByText('5 records · 2026-10-19', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Open contract for Demo Tenant 01', exact: true }).click();
  await page.getByRole('link', { name: 'Tenant details', exact: true }).click();
  await page.getByRole('link', { name: 'Files for C001', exact: true }).click();
  await expect(page.getByText('DEMO-CONTRACT-C001.txt', { exact: true })).toBeVisible();
  await expect(page.getByText('DEMO-RECEIPT-PAY001.txt', { exact: true })).toBeVisible();
  await expect(page.getByText('2 records · 2026-10-19', { exact: true })).toBeVisible();
});
