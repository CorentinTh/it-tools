import { expect, test } from '@playwright/test';

test.describe('Tool - Border generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/border-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Border Generator - IT Tools');
  });
});
