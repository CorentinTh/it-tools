import { test, expect } from '@playwright/test';

test.describe('Tool - Markdown viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/markdown-viewer');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Markdown viewer - IT Tools');
  });

  test('', async ({ page }) => {

  });
});