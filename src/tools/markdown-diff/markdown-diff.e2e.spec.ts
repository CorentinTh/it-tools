import { expect, test } from '@playwright/test';

test.describe('Tool - Markdown diff', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/markdown-diff');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Markdown diff - IT Tools', { timeout: 15000 });
  });

  test('Diff editor is visible with two editable panes', async ({ page }) => {
    await expect(page.getByTestId('markdown-diff-editor')).toBeVisible();

    await expect(page.locator('.monaco-diff-editor')).toBeVisible();
    await expect(page.locator('.monaco-editor textarea.inputarea')).toHaveCount(2);
  });

  test('Preview mode shows rendered source and modified Markdown', async ({ page }) => {
    await page.getByTestId('preview').click();

    await expect(page.getByTestId('markdown-preview')).toBeVisible();
    await expect(page.getByTestId('source-markdown-preview')).toBeVisible();
    await expect(page.getByTestId('modified-markdown-preview')).toBeVisible();
    await expect(page.getByTestId('source-markdown-preview').locator('table')).toBeVisible();
    await expect(page.getByTestId('modified-markdown-preview')).toContainText('caching_sha2_password');

    await page.getByTestId('code').click();

    await expect(page.getByTestId('markdown-diff-editor')).toBeVisible();
    await expect(page.locator('.monaco-diff-editor')).toBeVisible();
  });
});
