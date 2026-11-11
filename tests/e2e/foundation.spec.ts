import { expect, test } from '@playwright/test';
test('navigation, appearance and real API connectivity', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'A little more room for life.' })).toBeVisible();
  const navigationLink = page.getByRole('link', { name: 'Overview', exact: true });
  expect((await navigationLink.boundingBox())?.height).toBeGreaterThanOrEqual(48);
  await page.screenshot({ path: testInfo.outputPath('overview.png'), fullPage: true });
  await page.getByRole('button', { name: 'Check connection', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'API connected' })).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(/Database (ready|unavailable)/)).toBeVisible();
  await page.getByRole('link', { name: 'Settings', exact: true }).click();
  await page.getByRole('button', { name: 'Dark', exact: true }).click();
  await expect(page.getByText(/Current preference: dark/)).toBeVisible();
  await page.getByRole('button', { name: 'Light', exact: true }).click();
  await expect(page.getByText(/Current preference: light/)).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Make yourself at home.' })).toBeVisible();
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', await page.locator('body').evaluate(el => el.clientWidth));
});
