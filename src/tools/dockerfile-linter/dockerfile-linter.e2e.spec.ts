import { test, expect } from '@playwright/test';

test.describe('Tool - Dockerfile linter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dockerfile-linter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Dockerfile linter - IT Tools');
  });

  test('', async ({ page }) => {

  });
});