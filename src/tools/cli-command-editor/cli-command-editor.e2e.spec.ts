import { expect, test } from '@playwright/test';

test.describe('Tool - Cli command editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cli-command-editor');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Cli command editor - IT Tools');
  });
});
