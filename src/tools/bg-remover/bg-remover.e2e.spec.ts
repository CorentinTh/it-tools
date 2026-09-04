import { expect, test } from '@playwright/test';

test.describe('Tool - Bg remover', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/bg-remover');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Background remover - IT Tools');
  });

  test('Has a file upload zone', async ({ page }) => {
    await expect(page.getByText('Drag and drop an image here')).toBeVisible();
  });
});
