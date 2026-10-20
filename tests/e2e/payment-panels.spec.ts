import { test, expect } from './fixtures';
test('Manager tenant/stay panels agree after payment and related receipt context is exact', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByLabel('Email', { exact: true }).fill('manager@example.test');
  await page.getByLabel('Password', { exact: true }).fill(process.env.DEMO_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.goto('/#/tenants/TEN003');
  const table = page.getByRole('region', { name: 'Rental periods', exact: true });
  await expect(table).toContainText('Demo Tenant 03');
  await expect(table).not.toContainText('Demo Tenant 04');
  await table.getByRole('button', { name: 'Record payment', exact: true }).click();
  await page.getByLabel('Amount TWD', { exact: true }).fill('9000');
  await page.getByRole('button', { name: 'Save payment', exact: true }).click();
  await expect(table.getByText('Paid', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Rent periods for C003', exact: true }).click();
  await expect(
    page
      .getByRole('region', { name: 'Rental periods', exact: true })
      .getByText('Paid', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Payment history', exact: true }).click();
  await page.getByRole('link', { name: 'Receipt files for PAY002', exact: true }).click();
  await expect(page.getByText('DEMO-RECEIPT-PAY002.txt', { exact: true })).toBeVisible();
  await expect(page.getByText('1 records · 2026-10-19', { exact: true })).toBeVisible();
});
