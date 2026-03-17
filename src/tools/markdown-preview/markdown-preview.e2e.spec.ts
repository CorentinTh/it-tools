import { expect, test } from '@playwright/test';

test.describe('Tool - Markdown preview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/markdown-preview');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Markdown preview - IT Tools');
  });

  test('renders markdown in preview as user types', async ({ page }) => {
    await page.getByTestId('markdown-input').fill('# Hello World\n\n**Bold** and *italic*');
    const preview = page.getByTestId('markdown-preview');
    await expect(preview.locator('h1')).toHaveText('Hello World');
    await expect(preview.locator('strong')).toHaveText('Bold');
    await expect(preview.locator('em')).toHaveText('italic');
  });
});
