import { expect, test } from '@playwright/test';

test.describe('Tool - RAID Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/raid-calculator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('RAID Calculator - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
