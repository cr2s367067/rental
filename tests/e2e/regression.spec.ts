import { test, expect } from './fixtures';
for (const [category, width, height] of [
  ['mobile', 390, 844],
  ['tablet', 768, 1024],
  ['laptop', 1366, 768],
  ['desktop', 1920, 1080],
] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${category} ${theme}: essential contract-driven workflow`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.getByLabel('Email', { exact: true }).fill('owner@example.test');
      await page.getByLabel('Password', { exact: true }).fill(process.env.DEMO_PASSWORD!);
      await page.getByRole('button', { name: 'Sign in', exact: true }).click();
      await page.getByLabel('Theme', { exact: true }).selectOption(theme);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await expect(page.locator('[data-metric="total_properties"] strong')).toHaveText('4');
      await page.screenshot({
        path: `specs/001-property-management/validation/screenshots/${category}-${theme}-overview.png`,
        fullPage: true,
      });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.getByRole('link', { name: 'Properties', exact: true }).click();
      await page.getByRole('link', { name: 'Demo Taichung House', exact: true }).click();
      await page.getByRole('button', { name: 'Edit property', exact: true }).click();
      await page.getByLabel('City', { exact: true }).fill('Demo city');
      const box = await page.getByRole('dialog').boundingBox();
      expect(box!.width).toBeLessThanOrEqual(width - 16);
      await page.getByRole('button', { name: 'Save property', exact: true }).click();
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await expect(page.getByText('Demo city', { exact: true })).toBeVisible();
      await page.getByRole('link', { name: 'Resources', exact: true }).click();
      await page.getByRole('button', { name: 'Edit Room 202', exact: true }).click();
      await page.getByLabel('Capacity', { exact: true }).fill('2');
      await page.getByRole('button', { name: 'Save resource', exact: true }).click();
      await expect(page.getByRole('dialog')).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.getByRole('link', { name: 'Contracts', exact: true }).click();
      await page.getByRole('button', { name: 'Add contract', exact: true }).click();
      await page.getByLabel('Tenant selection', { exact: true }).selectOption('new');
      const name = `Responsive ${category} ${theme}`;
      await page.getByLabel('New tenant name', { exact: true }).fill(name);
      await page.getByLabel('Resource', { exact: true }).selectOption('R202');
      await page.getByLabel('Start date', { exact: true }).fill('2026-10-19');
      await page.getByLabel('End date', { exact: true }).fill('2027-10-19');
      await page.getByLabel('Monthly rent TWD', { exact: true }).fill('10000');
      await page.getByRole('button', { name: 'Save contract', exact: true }).click();
      await page.getByRole('link', { name: 'Open contract for ' + name, exact: true }).click();
      await page.getByRole('link', { name: 'Rent obligations & payments', exact: true }).click();
      await page.getByRole('button', { name: 'Add obligation', exact: true }).click();
      await page.getByLabel('Entry mode', { exact: true }).selectOption('MANUAL_PARTIAL_PERIOD');
      await page.getByLabel('Period start', { exact: true }).fill('2026-10-19');
      await page.getByLabel('Period end', { exact: true }).fill('2026-11-01');
      await page.getByLabel('Due date', { exact: true }).fill('2026-10-19');
      await page.getByLabel('Amount due TWD', { exact: true }).fill('4321');
      await page.getByRole('button', { name: 'Save obligation', exact: true }).click();
      await page.getByRole('button', { name: 'Record payment', exact: true }).click();
      await page.getByLabel('Amount TWD', { exact: true }).fill('1000');
      await page.getByRole('button', { name: 'Save payment', exact: true }).click();
      await expect(
        page
          .getByRole('region', { name: 'Rental periods', exact: true })
          .getByText('Partial Payment', { exact: true }),
      ).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.getByRole('link', { name: 'Contracts', exact: true }).click();
      await page.getByRole('link', { name: 'Open contract for ' + name, exact: true }).click();
      await page.getByRole('link', { name: 'Upload documents', exact: true }).click();
      await page.getByRole('button', { name: 'Upload file', exact: true }).click();
      await page.getByLabel('File', { exact: true }).setInputFiles({
        name: `${category}-${theme}.txt`,
        mimeType: 'text/plain',
        buffer: Buffer.from('Synthetic responsive document'),
      });
      await page.getByRole('button', { name: 'Save document', exact: true }).click();
      await expect(page.getByText(`${category}-${theme}.txt`, { exact: true })).toBeVisible();
      const download = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Download', exact: true }).click();
      expect((await download).suggestedFilename()).toBe(`${category}-${theme}.txt`);
      await page.getByRole('link', { name: 'Overview', exact: true }).click();
      await expect(page.locator('[data-metric="current_tenants"] strong')).toHaveText('7');
      await expect(page.getByTestId('outstanding-twd')).toHaveText('TWD 77,321');
      await expect(page.getByText(/Demo date: 2026-10-19/)).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    });
  }
}
for (const [category, width, height] of [
  ['mobile', 390, 844],
  ['tablet', 768, 1024],
  ['laptop', 1366, 768],
  ['desktop', 1920, 1080],
] as const) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${category} ${theme}: role and ownership controls`, async ({ page, browser }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await page.getByLabel('Email', { exact: true }).fill('owner@example.test');
      await page.getByLabel('Password', { exact: true }).fill(process.env.DEMO_PASSWORD!);
      await page.getByRole('button', { name: 'Sign in', exact: true }).click();
      await page.getByLabel('Theme', { exact: true }).selectOption(theme);
      await page.getByRole('link', { name: 'Users', exact: true }).click();
      await page.getByRole('button', { name: 'Add user', exact: true }).click();
      const name = `Owner ${category} ${theme}`;
      await page.getByLabel('Display name', { exact: true }).fill(name);
      await page.getByLabel('Email', { exact: true }).fill(`${category}-${theme}@example.test`);
      await page.getByLabel('Role', { exact: true }).selectOption('OWNER');
      await page.getByLabel('Password', { exact: true }).fill(process.env.DEMO_PASSWORD!);
      await page.getByRole('button', { name: 'Save user', exact: true }).click();
      await expect(page.getByText(name, { exact: true })).toBeVisible();
      await page.getByRole('link', { name: 'Property access', exact: true }).click();
      await page
        .getByLabel('Owner for Demo Taipei House', { exact: true })
        .selectOption({ label: name });
      await page
        .getByRole('button', { name: 'Save owner for Demo Taipei House', exact: true })
        .click();
      await expect(page.getByText('Ownership saved', { exact: true })).toBeVisible();
      await page.getByLabel('Select user', { exact: true }).selectOption('U003');
      await page.getByRole('checkbox', { name: 'Demo Taipei House', exact: true }).uncheck();
      await page.getByRole('checkbox', { name: 'Demo Taichung House', exact: true }).check();
      const granted = page.waitForResponse(
        (r) => r.url().endsWith('/users/U003/property-access') && r.request().method() === 'PUT',
      );
      await page.getByRole('button', { name: 'Save grants', exact: true }).click();
      expect((await granted).status()).toBe(200);
      await expect(
        page.getByRole('checkbox', { name: 'Demo Taichung House', exact: true }),
      ).toBeChecked();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.screenshot({
        path: `specs/001-property-management/validation/screenshots/${category}-${theme}-roles.png`,
        fullPage: true,
      });
      await page.getByRole('link', { name: 'Users', exact: true }).click();
      await page.getByRole('button', { name: 'Edit Demo Owner', exact: true }).click();
      await page.getByLabel('Enabled', { exact: true }).uncheck();
      await page.getByRole('button', { name: 'Save user', exact: true }).click();
      await expect(page.getByRole('alert')).toContainText('Reassign owned properties');
      await page.getByLabel('Close dialog').click();
      await page.getByRole('link', { name: 'Demo settings', exact: true }).click();
      await page.getByLabel('Business date', { exact: true }).fill('2026-10-20');
      await page.getByRole('button', { name: 'Update date', exact: true }).click();
      await expect(page.getByText(/Demo date: 2026-10-20/)).toBeVisible();
      const context = await browser.newContext({
        baseURL: 'http://localhost:5174',
        viewport: { width, height },
      });
      try {
        const viewer = await context.newPage();
        await viewer.goto('/');
        await viewer.getByLabel('Email', { exact: true }).fill('viewer@example.test');
        await viewer.getByLabel('Password', { exact: true }).fill(process.env.DEMO_PASSWORD!);
        await viewer.getByRole('button', { name: 'Sign in', exact: true }).click();
        await viewer.getByLabel('Theme', { exact: true }).selectOption(theme);
        await expect(viewer.locator('[data-metric="total_properties"] strong')).toHaveText('1');
        await expect(viewer.getByRole('link', { name: 'Users', exact: true })).toHaveCount(0);
        await viewer.getByRole('link', { name: 'Documents', exact: true }).click();
        await expect(viewer.getByText('DEMO-CONTRACT-C003.txt', { exact: true })).toBeVisible();
        await expect(viewer.getByRole('button', { name: 'Download', exact: true })).toHaveCount(0);
        expect((await viewer.request.get('/api/documents/DOC-C003/content')).status()).toBe(403);
        expect((await viewer.request.get('/api/properties/P001')).status()).toBe(403);
        const session = await (await viewer.request.get('/api/session')).json();
        expect(
          (
            await viewer.request.patch('/api/properties/P002', {
              headers: { origin: 'http://localhost:5174', 'x-csrf-token': session.csrf_token },
              data: { version: 1, name: 'Denied' },
            })
          ).status(),
        ).toBe(403);
        await viewer.getByRole('link', { name: 'Demo settings', exact: true }).click();
        await expect(viewer.getByLabel('Business date', { exact: true })).toHaveCount(0);
        await expect(viewer.getByText(/Demo date: 2026-10-20/)).toBeVisible();
        expect(
          await viewer.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        ).toBe(true);
      } finally {
        await context.close();
      }
    });
  }
}
