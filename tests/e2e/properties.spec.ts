import { test, expect } from './fixtures';
test('Owner creates/reopens property and resource; invalid capacity preserves occupied room', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByLabel('Email', { exact: true }).fill('owner@example.test');
  await page.getByLabel('Password', { exact: true }).fill(process.env.DEMO_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByRole('link', { name: 'Properties', exact: true }).click();
  await page.getByRole('button', { name: 'Add property', exact: true }).click();
  await page.getByLabel('Property name', { exact: true }).fill('Browser house');
  await page.getByLabel('City', { exact: true }).fill('Taipei');
  await page.getByLabel('Address', { exact: true }).fill('DEMO browser address');
  await page.getByRole('button', { name: 'Save property', exact: true }).click();
  await page.getByRole('link', { name: 'Browser house', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Browser house', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Manage resources', exact: true }).click();
  await page.getByRole('button', { name: 'Add resource', exact: true }).click();
  await page.getByLabel('Resource name', { exact: true }).fill('Browser room');
  await page.getByLabel('Capacity', { exact: true }).fill('2');
  await page.getByRole('button', { name: 'Save resource', exact: true }).click();
  await expect(page.getByText('Browser room', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Resources', exact: true }).click();
  await page.getByRole('button', { name: 'Edit Room 104', exact: true }).click();
  await page.getByLabel('Capacity', { exact: true }).fill('1');
  await page.getByRole('button', { name: 'Save resource', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('capacity');
  await expect(page.getByLabel('Capacity', { exact: true })).toHaveValue('1');
  await page.getByLabel('Close dialog').click();
  await page.reload();
  const row = page.getByRole('row').filter({ hasText: 'Room 104' });
  await expect(row).toContainText('2 / 2');
});
