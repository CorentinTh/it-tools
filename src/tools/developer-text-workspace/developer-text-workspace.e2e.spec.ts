import { expect, test } from '@playwright/test';

test.describe('Developer Text Workspace', () => {
  test('runs stack trace and Markdown TOC transformations explicitly', async ({ page }) => {
    await page.goto('/developer-text-workspace');
    await expect(page.locator('.tool-header h1')).toHaveText('Developer Text Workspace');
    await page.getByTestId('developer-text-run').click();
    await expect(page.getByTestId('developer-text-output')).toHaveValue(/ {2}at loadConfig/);

    await page.getByText('Markdown TOC', { exact: true }).click();
    await page.getByTestId('developer-text-run').click();
    await expect(page.getByTestId('developer-text-output')).toHaveValue(/\[Installation\]\(#installation\)/);
    await expect(page.getByTestId('developer-text-output')).not.toHaveValue(/Ignored code example/);
  });

  test('does not persist private input', async ({ page }) => {
    await page.goto('/developer-text-workspace');
    await page.getByTestId('developer-text-input').fill('secret-stack-value');
    await page.getByTestId('developer-text-run').click();
    await expect(page.getByTestId('developer-text-status')).toContainText('Completed');
    await page.reload();
    await expect(page.getByTestId('developer-text-input')).not.toHaveValue(/secret-stack-value/);
  });
});
