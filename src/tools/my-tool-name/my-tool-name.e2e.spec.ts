import { test, expect } from '@playwright/test';

test.describe('Tool - My tool name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/my-tool-name');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('My tool name - IT Tools');
  });

  test('', async ({ page }) => {

  });
});