import { expect, test } from '@playwright/test';

test.describe('Hash Text bounded worker lifecycle', () => {
  test('preserves all digest and encoding semantics for empty and Unicode input', async ({ page }) => {
    await page.goto('/hash-text');
    const sha256 = page.getByRole('textbox', { name: 'SHA256' });
    await expect(sha256).toHaveValue('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');

    await page.getByTestId('hash-text-input').fill('Привет 🌍');
    await expect(sha256).toHaveValue('d415d2646823ba3dd5ca460a26bd0e0cc066770bbdff46c7517bf70336b01fde');
    await page.getByRole('combobox', { name: 'Digest encoding' }).click();
    await page.getByRole('option', { name: 'Base64 (base 64)', exact: true }).click();
    await expect(sha256).toHaveValue('1BXSZGgjuj3VykYKJr0ODMBmdwu9/0bHUXv3AzawH94=');
  });

  test('requires an explicit action for large input and keeps the previous digests', async ({ page }) => {
    await page.goto('/hash-text');
    const input = page.getByTestId('hash-text-input');
    const sha256 = page.getByRole('textbox', { name: 'SHA256' });
    await input.fill('hello');
    await expect(sha256).toHaveValue('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');

    await input.fill('x'.repeat(17 * 1024));
    await expect(page.getByTestId('hash-text-status')).toContainText('Large input runs only on request');
    await expect(sha256).toHaveValue('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    await page.getByTestId('hash-text-run').click();
    await expect(page.getByTestId('hash-text-status')).toContainText('completed');
    await expect(sha256).not.toHaveValue('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });

  test('keeps hashed text session-only and off the network', async ({ page }) => {
    const marker = 'private-hash-input-7bb7d7';
    const requestedUrls: string[] = [];
    page.on('request', request => requestedUrls.push(request.url()));
    await page.goto('/hash-text');
    await page.getByTestId('hash-text-input').fill(marker);
    await expect(page.getByTestId('hash-text-status')).toContainText('completed');

    const browserState = await page.evaluate(() => ({
      local: Object.entries(localStorage),
      session: Object.entries(sessionStorage),
      url: location.href,
    }));
    expect(JSON.stringify(browserState)).not.toContain(marker);
    expect(requestedUrls.join('\n')).not.toContain(marker);
  });
});
