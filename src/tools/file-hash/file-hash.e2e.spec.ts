import { test, expect } from '@playwright/test';

test.describe('Tool - File hash', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/file-hash');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('File hash - IT Tools');
  });

  test('', async ({ page }) => {

  });
});