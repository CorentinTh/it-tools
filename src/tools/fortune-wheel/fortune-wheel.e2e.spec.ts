import { expect, test } from '@playwright/test';

test.describe('Tool - Fortune wheel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/fortune-wheel');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Fortune wheel - IT Tools');
  });
});
