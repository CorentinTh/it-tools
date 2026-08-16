import { expect, test } from '@playwright/test';

test.describe('Tool - Local encrypted OTP vault', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/local-encrypted-otp-vault');
    await page.evaluate(() => new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase('it-tools-otp-vault');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    }));
    await page.reload();
  });

  test('creates, persists, locks, and unlocks an authenticated local vault', async ({ page }) => {
    await expect(page).toHaveTitle('Local encrypted OTP vault - IT Tools');
    await page.getByTestId('otp-vault-passphrase').fill('correct horse battery staple');
    await page.getByTestId('otp-vault-confirmation').fill('correct horse battery staple');
    await page.getByTestId('otp-vault-create').click();
    await expect(page.getByTestId('otp-vault-empty')).toBeVisible({ timeout: 15_000 });

    await page.getByTestId('otp-vault-issuer').fill('Example');
    await page.getByTestId('otp-vault-label').fill('alice@example.com');
    await page.getByTestId('otp-vault-secret').fill('JBSWY3DPEHPK3PXP');
    await page.getByTestId('otp-vault-add').click();
    await expect(page.getByTestId('otp-vault-entries')).toContainText('alice@example.com', { timeout: 15_000 });

    const rawRecord = await page.evaluate(() => new Promise<unknown>((resolve, reject) => {
      const request = indexedDB.open('it-tools-otp-vault', 1);
      request.onsuccess = () => {
        const transaction = request.result.transaction('vault', 'readonly');
        const get = transaction.objectStore('vault').get('primary');
        get.onsuccess = () => resolve(get.result);
        get.onerror = () => reject(get.error);
      };
      request.onerror = () => reject(request.error);
    }));
    expect(JSON.stringify(rawRecord)).not.toContain('JBSWY3DPEHPK3PXP');

    await page.getByTestId('otp-vault-lock').click();
    await page.getByTestId('otp-vault-passphrase').fill('wrong password value');
    await page.getByTestId('otp-vault-unlock').click();
    await expect(page.getByTestId('otp-vault-error')).toContainText('Authentication failed', { timeout: 15_000 });
    await page.getByTestId('otp-vault-passphrase').fill('correct horse battery staple');
    await page.getByTestId('otp-vault-unlock').click();
    await expect(page.getByTestId('otp-vault-entries')).toContainText('alice@example.com', { timeout: 15_000 });
  });
});
