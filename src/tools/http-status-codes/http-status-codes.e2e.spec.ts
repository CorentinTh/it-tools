import { expect, test } from '@playwright/test';

test.describe('Tool - Http status codes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/http-status-codes');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('HTTP status codes - IT Tools');
  });
});
