import { expect, test } from '@playwright/test';

test.describe('Tool - MAC address generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mac-address-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('MAC address generator - IT Tools');
  });
});
