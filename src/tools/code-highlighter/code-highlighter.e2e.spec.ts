import { test, expect } from '@playwright/test';

test.describe('Tool - Code highlighter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/code-highlighter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Code highlighter - IT Tools');
  });

  test('', async ({ page }) => {

  });
});