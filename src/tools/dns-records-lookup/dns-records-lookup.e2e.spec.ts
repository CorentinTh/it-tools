import { expect, test } from '@playwright/test';

test.describe('Tool - Dns records lookup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dns-records-lookup');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Dns records lookup - Tech Tools');
  });
});
