import { test, expect } from './fixtures';
import { readFileSync } from 'node:fs';
const golden = JSON.parse(
  readFileSync('specs/001-property-management/mock-data/expected-results.json', 'utf8'),
).dashboard_by_user;
for (const [email, id] of [
  ['owner@example.test', 'U001'],
  ['manager@example.test', 'U002'],
  ['viewer@example.test', 'U003'],
])
  test(id + ' sees exact scoped metrics and every drill keeps date/filters', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Email', { exact: true }).fill(email);
    await page.getByLabel('Password', { exact: true }).fill(process.env.DEMO_PASSWORD!);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    for (const key of [
      'total_properties',
      'total_resources',
      'occupied_resources',
      'available_resources',
      'current_tenants',
      'upcoming_contract_starts',
      'upcoming_contract_ends',
      'unpaid_rent_periods',
      'contracts_expiring',
    ]) {
      const tile = page.locator('[data-metric="' + key + '"]');
      await expect(tile.locator('strong')).toHaveText(String(golden[id][key]));
      await tile.click();
      await expect(page).toHaveURL(/business_date=2026-10-19/);
      await expect(
        page.getByText(golden[id][key] + ' records · 2026-10-19', { exact: true }),
      ).toBeVisible();
      await page.getByRole('link', { name: 'Overview', exact: true }).click();
    }
    await expect(page.getByTestId('outstanding-twd')).toHaveText(
      'TWD ' + BigInt(golden[id].outstanding_twd).toLocaleString('en-US'),
    );
  });
test('payment mutation refreshes dashboard and property filter retains exact scope', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByLabel('Email', { exact: true }).fill('owner@example.test');
  await page.getByLabel('Password', { exact: true }).fill(process.env.DEMO_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.locator('[data-metric="unpaid_rent_periods"]').click();
  const row = page.getByRole('row').filter({ hasText: 'Demo Tenant 04' });
  await row.getByRole('button', { name: 'Record payment', exact: true }).click();
  await page.getByLabel('Amount TWD', { exact: true }).fill('11000');
  await page.getByRole('button', { name: 'Save payment', exact: true }).click();
  await page.getByRole('link', { name: 'Overview', exact: true }).click();
  await expect(page.locator('[data-metric="unpaid_rent_periods"] strong')).toHaveText('4');
  await expect(page.getByTestId('outstanding-twd')).toHaveText('TWD 63,000');
  await page.getByLabel('Property filter', { exact: true }).selectOption('P001');
  await expect(page.locator('[data-metric="total_properties"] strong')).toHaveText('1');
  await page.locator('[data-metric="available_resources"]').click();
  await expect(page).toHaveURL(/property_id=P001/);
  await expect(page.getByText('1 records · 2026-10-19', { exact: true })).toBeVisible();
});
