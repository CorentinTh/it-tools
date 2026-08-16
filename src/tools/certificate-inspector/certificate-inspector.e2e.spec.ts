import { expect, test } from '@playwright/test';

test.describe('Certificate and CSR Inspector', () => {
  test('inspects the default public key and computes a SHA-256 fingerprint', async ({ page }) => {
    await page.goto('/certificate-inspector');
    await expect(page.locator('.tool-header h1')).toHaveText('Certificate & CSR Inspector');
    await page.getByTestId('certificate-inspect').click();
    await expect(page.getByTestId('certificate-output')).toHaveValue(/"type": "SubjectPublicKeyInfo"/);
    await expect(page.getByTestId('certificate-output')).toHaveValue(/"publicKeyAlgorithm": "EC"/);
    await expect(page.getByTestId('certificate-output')).toHaveValue(/(?:[0-9A-F]{2}:){31}[0-9A-F]{2}/);
  });

  test('rejects and does not persist private-key content', async ({ page }) => {
    await page.goto('/certificate-inspector');
    await page.getByTestId('certificate-input').fill('-----BEGIN PRIVATE KEY-----\nAQID\n-----END PRIVATE KEY-----');
    await page.getByTestId('certificate-inspect').click();
    await expect(page.getByTestId('certificate-error')).toBeVisible();
    await page.reload();
    await expect(page.getByTestId('certificate-input')).not.toHaveValue(/PRIVATE KEY/);
  });
});
