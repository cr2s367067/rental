import { test, expect } from './fixtures';
async function signIn(page: import('@playwright/test').Page, email: string) {
  await page.goto('/');
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(process.env.DEMO_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
}
test('Manager edits a scoped contact, sees contract history and receives direct outscope feedback', async ({
  page,
}) => {
  await signIn(page, 'manager@example.test');
  await page.getByRole('link', { name: 'Tenants', exact: true }).click();
  await page.getByRole('link', { name: 'Demo Tenant 01', exact: true }).click();
  await expect(
    page
      .getByRole('region', { name: 'Contract occupancy', exact: true })
      .getByRole('link', { name: 'C001', exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Edit contact', exact: true }).click();
  await page.getByLabel('Tenant name', { exact: true }).fill('Browser contact');
  await page.getByRole('button', { name: 'Save contact', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Browser contact', exact: true })).toBeVisible();
  await page.goto('/#/tenants/TEN004');
  await expect(page.getByRole('alert')).toContainText('Tenant access denied');
  await page.getByRole('link', { name: 'Occupancy', exact: true }).click();
  await expect(page.getByRole('button', { name: /check.?in|check.?out/i })).toHaveCount(0);
});
test('Owner explicit demo date changes recompute upcoming contract occupancy and resources', async ({
  page,
}) => {
  await signIn(page, 'owner@example.test');
  await page.getByRole('link', { name: 'Occupancy', exact: true }).click();
  await expect(page.getByRole('row').filter({ hasText: 'C007' })).toContainText('Upcoming');
  await page.getByRole('link', { name: 'Demo settings', exact: true }).click();
  await page.getByLabel('Business date', { exact: true }).fill('2026-10-22');
  await page.getByRole('button', { name: 'Update date', exact: true }).click();
  await expect(page.getByText(/Demo date: 2026-10-22/)).toBeVisible();
  await page.getByRole('link', { name: 'Occupancy', exact: true }).click();
  await expect(page.getByRole('row').filter({ hasText: 'C007' })).toContainText('Current');
  await page.getByRole('link', { name: 'Resources', exact: true }).click();
  await expect(page.getByRole('row').filter({ hasText: 'Room 103' })).toContainText('Occupied');
  await page.getByRole('link', { name: 'Demo settings', exact: true }).click();
  await page.getByLabel('Business date', { exact: true }).fill('2026-10-19');
  await page.getByRole('button', { name: 'Update date', exact: true }).click();
  await expect(page.getByText(/Demo date: 2026-10-19/)).toBeVisible();
});
