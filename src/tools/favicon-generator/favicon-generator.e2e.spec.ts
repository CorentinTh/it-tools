import { expect, test } from '@playwright/test';

test.describe('Tool - Favicon generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/favicon-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Favicon generator - IT Tools');
  });

  test('', async () => {

  });
});
