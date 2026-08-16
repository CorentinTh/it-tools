import { expect, test } from '@playwright/test';

test.describe('Argon2id Hash & Verify', () => {
  test('hashes, verifies, stays ephemeral, and physically cancels expensive work', async ({ page }) => {
    const password = 'browser-only-secret-42';
    const requestLeaks: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes(password) || (request.postData() ?? '').includes(password)) {
        requestLeaks.push(request.url());
      }
    });
    await page.goto('/argon2id-hash-verify');
    await expect(page.getByRole('heading', { name: 'Argon2id Hash & Verify' })).toBeVisible();

    await page.getByTestId('argon2id-password').fill(password);
    await page.getByTestId('argon2id-memory').locator('input').fill('32');
    await page.getByTestId('argon2id-iterations').locator('input').fill('1');
    await page.getByTestId('argon2id-parallelism').locator('input').fill('1');
    await page.getByTestId('argon2id-hash-length').locator('input').fill('16');
    await page.getByTestId('argon2id-run').click();
    await expect(page.getByTestId('argon2id-output')).toHaveValue(/^\$argon2id\$v=19\$m=32,t=1,p=1\$[A-Za-z0-9+/]+\$[A-Za-z0-9+/]+$/u);
    const phc = await page.getByTestId('argon2id-output').inputValue();

    expect(page.url()).not.toContain(password);
    const persisted = await page.evaluate(() => JSON.stringify({ local: localStorage, session: sessionStorage }));
    expect(persisted).not.toContain(password);
    expect(persisted).not.toContain(phc);
    expect(requestLeaks).toEqual([]);

    await page.getByText('Verify PHC string', { exact: true }).click();
    await page.getByTestId('argon2id-password').fill(password);
    await page.getByTestId('argon2id-phc-input').fill(phc);
    await page.getByTestId('argon2id-run').click();
    await expect(page.getByTestId('argon2id-verify-result')).toContainText('matches');

    await page.getByTestId('argon2id-password').fill('wrong-password');
    await page.getByTestId('argon2id-run').click();
    await expect(page.getByTestId('argon2id-verify-result')).toContainText('does not match');

    await page.getByText('Hash password', { exact: true }).click();
    await page.getByTestId('argon2id-password').fill(password);
    await page.getByTestId('argon2id-memory').locator('input').fill('262144');
    await page.getByTestId('argon2id-iterations').locator('input').fill('10');
    await page.getByTestId('argon2id-run').click();
    await expect(page.getByTestId('argon2id-cancel')).toBeVisible();
    await page.getByTestId('argon2id-cancel').click();
    await expect(page.getByTestId('argon2id-status')).toContainText('worker was terminated');
    await expect(page.getByTestId('argon2id-output')).toHaveValue('');
  });
});
