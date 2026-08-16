import { expect, test } from '@playwright/test';

test.describe('CLI Command Editor', () => {
  test('loads, parses repeated flags and safely re-quotes an edited token', async ({ page }) => {
    await page.goto('/cli-command-editor');
    await expect(page.locator('.tool-header h1')).toHaveText('CLI Command Editor');
    await page.getByTestId('cli-command-parse').click();
    await expect(page.getByTestId('cli-command-tokens')).toBeVisible();
    await expect(page.getByTestId('cli-command-output')).toHaveValue(/--glob '\*\.ts'/);

    await page.getByTestId('cli-token-6').fill('new value\'s');
    await expect(page.getByTestId('cli-command-output')).toHaveValue(/'new value'"'"'s'/);
  });

  test('switches to PowerShell without persisting command content', async ({ page }) => {
    await page.goto('/cli-command-editor');
    await page.getByText('PowerShell', { exact: true }).click();
    await page.getByTestId('cli-command-parse').click();
    await expect(page.getByTestId('cli-command-status')).toContainText('Parsed');
    await page.reload();
    await expect(page.getByTestId('cli-command-source')).not.toHaveValue(/secret-value/);
  });
});
