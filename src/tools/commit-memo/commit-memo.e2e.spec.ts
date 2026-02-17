import { expect, test } from '@playwright/test';

test.describe('Tool - Conventional Commit Cheatsheet', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/commit-memo');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Conventional Commit Cheatsheet - IT Tools');
  });

  test('', async ({ page }) => {

  });
});
