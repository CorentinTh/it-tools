import { expect, test } from '@playwright/test';

test.describe('JSON Repair and Query', () => {
  test('repairs JSON5-style input and runs a safe wildcard query', async ({ page }) => {
    await page.goto('/json-repair-query');
    await expect(page.locator('.tool-header h1')).toHaveText('JSON Repair & Query');
    await page.getByTestId('json-workspace-run').click();
    await expect(page.getByTestId('json-workspace-output')).toHaveValue(/"users"/);

    await page.getByText('Query JSON', { exact: true }).click();
    await page.getByTestId('json-workspace-run').click();
    await expect(page.getByTestId('json-workspace-output')).toHaveValue('[\n  "Ada",\n  "Grace"\n]');
  });

  test('rejects executable JSONPath filters', async ({ page }) => {
    await page.goto('/json-repair-query');
    await page.getByText('Query JSON', { exact: true }).click();
    await page.getByTestId('json-workspace-query').fill('$.users[?(@.active)]');
    await page.getByTestId('json-workspace-run').click();
    await expect(page.getByTestId('json-workspace-error')).toBeVisible();
  });
});
