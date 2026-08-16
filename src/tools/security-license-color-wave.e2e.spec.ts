import { expect, test } from '@playwright/test';

test.describe('JWT, HOTP, SPDX, and OKLCH wave', () => {
  test('signs and verifies an HS256 JWT without persisting the secret', async ({ page }) => {
    await page.goto('/jwt-parser');
    await page.getByLabel('Operation', { exact: true }).click();
    await page.getByRole('option', { name: 'Sign with HMAC', exact: true }).click();
    await page.getByTestId('jwt-secret').locator('input').fill('0123456789abcdef0123456789abcdef');
    await page.getByLabel('Payload JSON object').fill('{"sub":"browser-user","exp":4102444800}');
    await page.getByTestId('jwt-run').click();
    const output = page.getByTestId('jwt-output').locator('textarea');
    await expect(output).toHaveValue(/^eyJ/u);
    const token = await output.inputValue();

    await page.getByLabel('Operation', { exact: true }).click();
    await page.getByRole('option', { name: 'Verify HMAC signature', exact: true }).click();
    await page.getByTestId('jwt-token-input').locator('textarea').fill(token);
    await page.getByTestId('jwt-run').click();
    await expect(page.getByTestId('jwt-status')).toContainText('signature is valid');
    expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('0123456789abcdef');
  });

  test('generates the first RFC 4226 HOTP vector with an exact counter', async ({ page }) => {
    await page.goto('/otp-generator');
    await page.getByLabel('OTP mode').click();
    await page.getByRole('option', { name: 'HOTP — counter based', exact: true }).click();
    await page.getByLabel('RFC 4648 Base32 secret').fill('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ');
    await page.getByLabel('HOTP counter (0 to 2^64 − 1)').fill('0');
    await page.getByTestId('hotp-generate').click();
    await expect(page.getByTestId('hotp-output').locator('input')).toHaveValue('755224');
  });

  test('labels SPDX triage as guidance and identifies a known conflict signal', async ({ page }) => {
    await page.goto('/spdx-license-guidance');
    await page.getByLabel('Declared project/distribution license').click();
    await page.getByRole('option', { name: /^GPL-2\.0-only/u }).click();
    await page.getByLabel(/Dependency SPDX identifiers/u).fill('Apache-2.0');
    await page.getByTestId('spdx-assess').click();
    await expect(page.getByTestId('spdx-results')).toContainText('conflict');
    await expect(page.getByText('Identification and triage — not legal advice')).toBeVisible();
  });

  test('detects and maps an out-of-sRGB OKLCH color', async ({ page }) => {
    await page.goto('/color-converter');
    await page.getByTestId('input-oklch').locator('input').fill('oklch(80.72% 0.3296 141.6)');
    await expect(page.getByTestId('oklch-gamut-status')).toContainText('Outside sRGB');
    await expect(page.getByLabel('sRGB gamut-mapped OKLCH')).not.toHaveValue('oklch(80.72% 0.3296 141.6)');
  });
});
