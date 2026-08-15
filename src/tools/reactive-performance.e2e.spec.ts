import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test.describe('Bounded reactive text tools', () => {
  test('Math evaluation is debounced, explicit, and reports sanitized errors', async ({ page }) => {
    await page.goto('/math-evaluator');
    const input = page.getByRole('textbox', { name: 'Math expression' });
    await input.fill('2 * sqrt(9)');
    await expect(page.getByTestId('math-status')).toContainText('Waiting to run');
    await expect(page.getByTestId('math-result')).toHaveText('6');

    await input.fill('2 +');
    await page.getByTestId('math-run').click();
    await expect(page.getByTestId('math-status')).toContainText('could not be evaluated');
  });

  test('SQL switches large documents to an explicit worker action', async ({ page }) => {
    await page.goto('/sql-prettify');
    const input = page.getByRole('textbox', { name: 'Your SQL query' });
    const largeSql = `select '${'a'.repeat(65 * 1024)}' as value;`;
    await input.fill(largeSql);
    await expect(page.getByTestId('sql-format-status')).toContainText('Large input runs only on request');

    await page.getByTestId('sql-format-run').click();
    await expect(page.getByTestId('sql-format-status')).toContainText('completed', { timeout: 15_000 });
    await expect(page.getByTestId('area-content')).toContainText('SELECT');
  });

  test('XML and Markdown expose worker validation and completed output states', async ({ page }) => {
    await page.goto('/xml-formatter');
    await page.getByTestId('input').fill('hello world');
    await expect(page.getByTestId('xml-format-status')).toContainText('could not be formatted');

    await page.goto('/markdown-to-html');
    await page.getByRole('textbox', { name: 'Your Markdown to convert:' }).fill('# Worker output');
    await expect(page.getByTestId('markdown-status')).toContainText('completed');
    await expect(page.getByTestId('area-content')).toContainText('<h1>Worker output</h1>');
  });

  test('Large Text Statistics stays idle until the explicit analysis', async ({ page }) => {
    await page.goto('/text-statistics');
    const input = page.getByRole('textbox', { name: 'Text to analyze' });
    const largeText = 'word '.repeat(55_000);
    await input.fill(largeText);
    await expect(page.getByTestId('text-statistics-status')).toContainText('only on request');
    await expect(page.getByText('Character count').locator('..').locator('dd')).toHaveText('0');

    await page.getByTestId('text-statistics-run').click();
    await expect(page.getByTestId('text-statistics-status')).toContainText('analyzed', { timeout: 15_000 });
    await expect(page.getByText('Word count').locator('..').locator('dd')).toHaveText('55000');
  });
});
