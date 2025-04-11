import { test, expect } from '@playwright/test';

test.describe('Tool - Mermaid exporter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mermaid-exporter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Mermaid exporter - IT Tools');
  });

  test('', async ({ page }) => {

  });
});