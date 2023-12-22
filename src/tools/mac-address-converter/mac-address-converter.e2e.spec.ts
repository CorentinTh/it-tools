import { test, expect } from '@playwright/test';

test.describe('Tool - Mac address converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mac-address-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Mac address converter - IT Tools');
  });

  test('', async ({ page }) => {

  });
});