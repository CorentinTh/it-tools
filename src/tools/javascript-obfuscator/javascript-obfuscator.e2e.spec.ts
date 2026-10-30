import { expect, test } from '@playwright/test';

test.describe('Tool - JavaScript Obfuscator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/javascript-obfuscator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('JavaScript Obfuscator - IT Tools');
  });
});
