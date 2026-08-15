import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test.describe('QR generation lifecycle', () => {
  test('orders and bounds general QR generation without leaving stale output', async ({ page }) => {
    await page.goto('/qrcode-generator');
    await expect(page.getByTestId('qrcode-status')).toHaveText('QR code ready.');
    const image = page.getByRole('img', { name: 'Generated QR code' });
    const initialSource = await image.getAttribute('src');
    expect(initialSource).toMatch(/^data:image\/png;base64,/);

    const text = page.getByRole('textbox', { name: 'Text' });
    await text.fill('');
    await expect(page.getByTestId('qrcode-status')).toHaveText('Enter text to generate a QR code.');
    await expect(image).toHaveCount(0);
    await expect(page.getByTestId('qrcode-download')).toBeDisabled();

    await text.fill('first');
    await text.fill('latest');
    await expect(page.getByTestId('qrcode-status')).toHaveText('QR code ready.');
    await expect(image).toBeVisible();
    expect(await image.getAttribute('src')).not.toBe(initialSource);

    await text.fill('x'.repeat(4_097));
    await expect(page.getByTestId('qrcode-status')).toContainText('exceeds 4,096 UTF-8 bytes');
    await expect(image).toHaveCount(0);
    await expect(page.getByTestId('qrcode-download')).toBeDisabled();
  });

  test('clears a WiFi QR as soon as required fields become incomplete', async ({ page }) => {
    await page.goto('/wifi-qrcode-generator');
    const status = page.getByTestId('wifi-qrcode-status');
    await expect(status).toContainText('Complete the required WiFi fields');
    await expect(page.getByTestId('wifi-qrcode-result')).toHaveCount(0);

    await page.getByRole('textbox', { name: 'SSID' }).fill('office');
    await page.getByLabel('Password', { exact: true }).fill('secret');
    await expect(status).toHaveText('WiFi QR code ready.');
    await expect(page.getByTestId('wifi-qrcode-result')).toBeVisible();

    await page.getByLabel('Password', { exact: true }).fill('');
    await expect(status).toContainText('Complete the required WiFi fields');
    await expect(page.getByTestId('wifi-qrcode-result')).toHaveCount(0);
  });
});
