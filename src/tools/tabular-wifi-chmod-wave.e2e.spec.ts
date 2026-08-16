import { expect, test } from '@playwright/test';

test.describe('Tabular, Wi-Fi QR, and Chmod interoperability wave', () => {
  test('inspects quoted tabular data and preserves empty cells in JSON', async ({ page }) => {
    await page.goto('/tabular-data-inspector');
    await page.getByLabel('CSV or TSV input').fill('name,code,empty\n"A, B",001,');
    await page.getByLabel('Output').click();
    await page.getByRole('option', { name: 'JSON — preserve every cell as text', exact: true }).click();
    await page.getByTestId('tabular-process').click();
    await expect(page.locator('.c-task-status')).toContainText('Completed');
    await expect(page.getByLabel('JSON rows')).toHaveValue(/"code": "001"/u);
    await expect(page.getByLabel('JSON rows')).toHaveValue(/"empty": ""/u);
  });

  test('emits a scanner-compatible payload for WPA3 intent and exposes the exact text', async ({ page }) => {
    await page.goto('/wifi-qrcode-generator');
    await page.getByLabel('Encryption method').click();
    await page.getByRole('option', { name: 'WPA3 Personal (compatible payload)', exact: true }).click();
    await page.getByLabel('SSID', { exact: true }).fill('sae-network');
    await page.getByLabel('Password', { exact: true }).fill('correct horse');
    await expect(page.getByTestId('wifi-qrcode-result')).toBeVisible();
    await expect(page.getByLabel('Exact encoded WIFI payload (contains the password)')).toHaveValue('WIFI:S:sae-network;T:WPA;P:correct horse;;');
  });

  test('parses special chmod bits and calculates creation umask guidance', async ({ page }) => {
    await page.goto('/chmod-calculator');
    await page.getByTestId('chmod-mode-input').locator('input').fill('6755');
    await page.getByTestId('chmod-apply-mode').click();
    await expect(page.getByTestId('chmod-octal')).toHaveText('6755');
    await expect(page.getByTestId('chmod-symbolic')).toHaveText('rwsr-sr-x');
    await expect(page.getByLabel('Effective base permission')).toHaveValue('644');
  });
});
