import { Buffer } from 'node:buffer';
import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const publicKey = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
-----END PUBLIC KEY-----`;

test.describe('Tool - PKCS#12 / PEM Workspace', () => {
  test('checks a modern PFX and exports certificates without exposing the private key', async ({ page }) => {
    const fixture = readFileSync(new URL('./fixtures/modern-pfx.base64', import.meta.url), 'utf8').trim();
    await page.goto('/pkcs12-pem-workspace');
    await expect(page).toHaveTitle('PKCS#12 / PEM Workspace - IT Tools');
    await page.getByTestId('pkcs12-file').locator('input[type="file"]').setInputFiles({
      buffer: Buffer.from(fixture, 'base64'),
      mimeType: 'application/x-pkcs12',
      name: 'fixture.p12',
    });
    await page.getByTestId('pkcs12-password').locator('input').fill('testpass');
    await page.getByTestId('pkcs12-pem-run').click();
    await expect(page.getByTestId('pkcs12-pem-status')).toContainText('Private key material was not exported');
    await expect(page.getByTestId('pkcs12-password').locator('input')).toHaveValue('');
    const report = page.getByTestId('pkcs12-pem-output').locator('textarea');
    await expect(report).toHaveValue(/"certificateCount": 1/);
    await expect(report).toHaveValue(/"privateKeyBagCount": 1/);
    await expect(report).toHaveValue(/"privateMaterialExported": false/);
    await expect(report).toHaveValue(/-----BEGIN CERTIFICATE-----/);
    expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('testpass');
  });

  test('normalizes a public PEM bundle and rejects private-key labels', async ({ page }) => {
    await page.goto('/pkcs12-pem-workspace');
    await page.getByLabel('Input format').click();
    await page.getByRole('option', { name: 'Public PEM bundle', exact: true }).click();
    const source = page.getByTestId('pem-workspace-source').locator('textarea');
    await source.fill(`\n${publicKey}\n`);
    await page.getByTestId('pkcs12-pem-run').click();
    await expect(page.getByTestId('pkcs12-pem-output').locator('textarea')).toHaveValue(/"publicKeyAlgorithm": "Ed25519"/);

    await source.fill('-----BEGIN PRIVATE KEY-----\nAQID\n-----END PRIVATE KEY-----');
    await page.getByTestId('pkcs12-pem-run').click();
    await expect(page.getByTestId('pkcs12-pem-error')).toContainText('processing failed');
  });
});
