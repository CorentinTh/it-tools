import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test.describe('Tool - QR decoder and OTP import', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/qr-decoder-otp-import');
  });

  test('parses a manually supplied OTP payload without starting the camera', async ({ page }) => {
    await expect(page).toHaveTitle('QR Decoder & OTP Import - IT Tools');
    await expect(page.getByTestId('qr-camera-preview')).toHaveJSProperty('srcObject', null);
    await page.getByTestId('qr-payload').fill('otpauth://totp/Example:alice?secret=JBSWY3DPEHPK3PXP&issuer=Example&digits=8');
    await page.getByTestId('qr-parse-otp').click();
    await expect(page.getByTestId('otp-result')).toContainText('"kind": "totp"');
    await expect(page.getByTestId('otp-result')).toContainText('"secret": "JBSWY3DPEHPK3PXP"');
    await expect(page.getByTestId('qr-status')).toContainText('configuration parsed locally');
  });

  test('rejects invalid provisioning data and does not persist secrets', async ({ page }) => {
    const secret = 'NOT-BASE32';
    await page.getByTestId('qr-payload').fill(`otpauth://totp/alice?secret=${secret}`);
    await page.getByTestId('qr-parse-otp').click();
    await expect(page.getByTestId('qr-error')).toContainText('Base32');
    const stored = await page.evaluate(() => [...Object.values(localStorage), ...Object.values(sessionStorage)].join('\n'));
    expect(stored).not.toContain(secret);
    await page.reload();
    await expect(page.getByTestId('qr-payload')).toHaveValue('');
  });
});
