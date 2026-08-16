import { expect, test } from '@playwright/test';

test.describe('JSON Schema and Code Generator', () => {
  test('infers JSON Schema and TypeScript through the bounded worker', async ({ page }) => {
    await page.goto('/json-code-generator');
    await expect(page.locator('.tool-header h1')).toHaveText('JSON Schema & Code Generator');
    await page.getByTestId('json-code-run').click();
    await expect(page.getByTestId('json-code-output')).toHaveValue(/draft\/2020-12\/schema/);
    await expect(page.getByTestId('json-code-output')).toHaveValue(/"users"/);

    await page.getByText('TypeScript', { exact: true }).click();
    await page.getByTestId('json-code-run').click();
    await expect(page.getByTestId('json-code-output')).toHaveValue(/export interface ApiResponse/);
    await expect(page.getByTestId('json-code-output')).toHaveValue(/users: Array/);
  });

  test('keeps JSON examples out of persistence', async ({ page }) => {
    await page.goto('/json-code-generator');
    await page.getByTestId('json-code-input').fill('{"private":"secret-value"}');
    await page.getByTestId('json-code-run').click();
    await expect(page.getByTestId('json-code-status')).toContainText('Completed');
    await page.reload();
    await expect(page.getByTestId('json-code-input')).not.toHaveValue(/secret-value/);
  });
});
