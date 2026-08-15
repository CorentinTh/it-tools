import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test.describe('HTML WYSIWYG bounded formatting', () => {
  test('formats small edits in a worker after typing pauses', async ({ page }) => {
    await page.goto('/html-wysiwyg-editor');
    await expect(page.getByTestId('wysiwyg-status')).toContainText('Formatted HTML is ready', { timeout: 15_000 });
    await expect(page.getByTestId('wysiwyg-result')).toContainText('<h1>Hey!</h1>');

    const editor = page.locator('[contenteditable="true"]');
    await editor.fill('A private local draft');
    await expect(page.getByTestId('wysiwyg-result')).toHaveCount(0);
    await expect(page.getByTestId('wysiwyg-status')).toContainText('Formatted HTML is ready', { timeout: 15_000 });
    await expect(page.getByTestId('wysiwyg-result')).toContainText('<h1>A private local draft</h1>');
  });

  test('requires an explicit action instead of auto-formatting a large document', async ({ page }) => {
    await page.goto('/html-wysiwyg-editor');
    await expect(page.getByTestId('wysiwyg-status')).toContainText('Formatted HTML is ready', { timeout: 15_000 });

    await page.locator('[contenteditable="true"]').fill('x'.repeat((64 * 1024) + 1));

    await expect(page.getByTestId('wysiwyg-status')).toContainText('Select Format HTML to process it once');
    await expect(page.getByTestId('wysiwyg-result')).toHaveCount(0);
    await expect(page.getByTestId('wysiwyg-format')).toBeEnabled();
  });
});
