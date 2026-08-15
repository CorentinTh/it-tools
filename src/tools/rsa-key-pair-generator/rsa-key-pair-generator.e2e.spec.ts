import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test.describe('Tool - RSA key pair generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rsa-key-pair-generator');
  });

  test('generates a supported pair only after an explicit action and keeps it session-only', async ({ page }) => {
    await expect(page).toHaveTitle('RSA key pair generator - IT Tools');
    await expect(page.getByRole('radiogroup', { name: 'Key size' })).toBeVisible();
    await expect(page.getByRole('radio')).toHaveCount(3);
    await expect(page.getByTestId('rsa-results')).toHaveCount(0);
    await expect(page.getByTestId('rsa-status')).toContainText('No key is created automatically');

    await page.getByTestId('3072').click();
    await expect(page.getByTestId('rsa-results')).toHaveCount(0);
    await expect(page.getByTestId('rsa-status')).toContainText('Ready to generate a 3,072-bit');

    await page.getByTestId('2048').click();
    await page.getByTestId('rsa-generate').click();
    await expect(page.getByTestId('rsa-status')).toContainText('Generated a 2,048-bit RSA key pair', {
      timeout: 30_000,
    });

    const publicKey = page.getByTestId('rsa-public-key').getByTestId('area-content');
    const privateKey = page.getByTestId('rsa-private-key').getByTestId('area-content');
    await expect(publicKey).toContainText('-----BEGIN PUBLIC KEY-----');
    await expect(publicKey).toContainText('-----END PUBLIC KEY-----');
    await expect(privateKey).toContainText('-----BEGIN PRIVATE KEY-----');
    await expect(privateKey).toContainText('-----END PRIVATE KEY-----');

    const privateKeyPem = await privateKey.textContent();
    if (!privateKeyPem) {
      throw new Error('The generated private key is unavailable.');
    }
    const browserState = await page.evaluate(() => ({
      local: Object.values(localStorage),
      session: Object.values(sessionStorage),
      url: window.location.href,
    }));
    expect(browserState.local.every(value => !value.includes(privateKeyPem))).toBe(true);
    expect(browserState.session.every(value => !value.includes(privateKeyPem))).toBe(true);
    expect(browserState.url).not.toContain(privateKeyPem);

    await page.reload();
    await expect(page.getByTestId('rsa-results')).toHaveCount(0);
    await expect(page.getByTestId('rsa-status')).toContainText('No key is created automatically');
  });

  test('physically cancels replacement work without clearing the previous pair', async ({ page }) => {
    await page.getByTestId('rsa-generate').click();
    await expect(page.getByTestId('rsa-status')).toContainText('Generated a 2,048-bit RSA key pair', {
      timeout: 30_000,
    });
    const publicKey = page.getByTestId('rsa-public-key').getByTestId('area-content');
    const privateKey = page.getByTestId('rsa-private-key').getByTestId('area-content');
    const originalPublicKey = await publicKey.textContent();
    const originalPrivateKey = await privateKey.textContent();

    await page.getByTestId('4096').click();
    await page.getByTestId('rsa-generate').click();
    await page.getByTestId('rsa-cancel').click();

    await expect(page.getByTestId('rsa-status')).toContainText('previous pair is still available');
    await expect(publicKey).toHaveText(originalPublicKey ?? '');
    await expect(privateKey).toHaveText(originalPrivateKey ?? '');
  });
});
