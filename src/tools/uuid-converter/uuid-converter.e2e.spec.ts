import { test, expect } from '@playwright/test';

test.describe('Tool - Uuid converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/uuid-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Uuid converter - IT Tools');
  });

  test('', async ({ page }) => {

  });
});