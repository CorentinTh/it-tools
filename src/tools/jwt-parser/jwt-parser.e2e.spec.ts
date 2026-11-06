import { generateKeyPairSync } from 'node:crypto';
import { expect, test } from '@playwright/test';

const SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
const SHARED_JWT = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhYmMifQ.abc';
const RS256_HEADER_SEGMENT = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9';

test.describe('Tool - JWT parser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/jwt-parser');
    await expect(page.getByTestId('jwt-encoded')).toBeVisible();
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('JWT parser - Toolbox');
  });

  test('the default token is decoded and verified', async ({ page }) => {
    await expect(page.getByTestId('jwt-payload')).toHaveValue(/"name": "John Doe"/);
    await expect(page.getByTestId('jwt-status')).toContainText('Signature verified');
  });

  test('editing the payload re-signs the token', async ({ page }) => {
    await page.getByTestId('jwt-payload').fill('{"sub":"abc"}');

    await expect(page.getByTestId('jwt-encoded')).toHaveValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhYmMifQ.waLX2KAou4Urqf0pxJvgPEnQPuArnMYuxzZ2jXgsjXI');
    await expect(page.getByTestId('jwt-status')).toContainText('Signature verified');
  });

  test('invalid payload JSON keeps the last token and shows an error', async ({ page }) => {
    await page.getByTestId('jwt-payload').fill('{ not json');

    await expect(page.getByTestId('jwt-signing-error')).toHaveText('The payload is not valid JSON.');
    await expect(page.getByTestId('jwt-encoded')).toHaveValue(SAMPLE_JWT);
  });

  test('a tampered token shows an invalid signature', async ({ page }) => {
    await page.getByTestId('jwt-encoded').fill(`${SAMPLE_JWT.slice(0, -4)}AAAA`);

    await expect(page.getByTestId('jwt-status')).toContainText('Invalid signature');
  });

  test('a malformed token shows an error and disables sharing', async ({ page }) => {
    await page.getByTestId('jwt-encoded').fill('garbage');

    await expect(page.getByTestId('jwt-invalid')).toBeVisible();
    await expect(page.getByTestId('jwt-share')).toHaveClass(/disabled/);
  });

  test('editing the secret re-signs the token', async ({ page }) => {
    await page.getByTestId('jwt-secret').fill('another-secret');

    await expect(page.getByTestId('jwt-encoded')).not.toHaveValue(SAMPLE_JWT);
    await expect(page.getByTestId('jwt-status')).toContainText('Signature verified');
  });

  test('a token with an asymmetric algorithm shows the key fields', async ({ page }) => {
    await page.getByTestId('jwt-encoded').fill('eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ4In0.abc');

    await expect(page.getByTestId('jwt-public-key')).toBeVisible();
    await expect(page.getByTestId('jwt-private-key')).toBeVisible();
    await expect(page.getByTestId('jwt-status')).toContainText('Enter a public key to verify the signature');
  });

  test('PKCS#1 keys sign and verify a token', async ({ page }) => {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });

    await page.getByTestId('jwt-header').fill('{"alg":"RS256","typ":"JWT"}');
    await page.getByTestId('jwt-public-key').fill(publicKey.export({ type: 'pkcs1', format: 'pem' }).toString());
    await page.getByTestId('jwt-private-key').fill(privateKey.export({ type: 'pkcs1', format: 'pem' }).toString());

    await expect(page.getByTestId('jwt-status')).toContainText('Signature verified');
    await expect(page.getByTestId('jwt-signing-error')).toHaveCount(0);
  });

  test('a public key edit does not cancel a running re-sign', async ({ page }) => {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });

    await page.getByTestId('jwt-header').fill('{"alg":"RS256","typ":"JWT"}');
    await page.route('**/assets/**', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await route.continue();
    });

    await page.getByTestId('jwt-private-key').fill(privateKey.export({ type: 'pkcs1', format: 'pem' }).toString());
    await page.getByTestId('jwt-public-key').fill(publicKey.export({ type: 'spki', format: 'pem' }).toString());

    await expect(page.getByTestId('jwt-encoded')).toHaveValue(new RegExp(`^${RS256_HEADER_SEGMENT}\\.`));
    await expect(page.getByTestId('jwt-status')).toContainText('Signature verified');
  });

  test('a failed re-sign reports that the token is out of date', async ({ page }) => {
    await page.getByTestId('jwt-header').fill('{"alg":"RS256","typ":"JWT"}');

    await expect(page.getByTestId('jwt-signing-error')).toHaveText('Enter a private key to sign the token.');
    await expect(page.getByTestId('jwt-status')).toContainText('Token not updated');
    await expect(page.getByTestId('jwt-share')).toHaveClass(/disabled/);
    await expect(page.getByTestId('jwt-encoded')).toHaveValue(SAMPLE_JWT);
  });

  test('a payload with an unsafe integer shows a warning', async ({ page }) => {
    await page.getByTestId('jwt-payload').fill('{"id":12345678901234567890}');

    await expect(page.getByTestId('jwt-unsafe-integer')).toBeVisible();
  });

  test('an empty token in the URL fragment keeps the default token', async ({ page }) => {
    await page.goto('about:blank');
    await page.goto('/jwt-parser#token=');

    await expect(page.getByTestId('jwt-encoded')).toHaveValue(SAMPLE_JWT);
  });

  test('the token field has focus on every in-app navigation', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[href="/jwt-parser"]').first().click();
    await expect(page.getByTestId('jwt-encoded')).toBeFocused();

    await page.goBack();
    await page.locator('a[href="/jwt-parser"]').first().click();
    await expect(page.getByTestId('jwt-encoded')).toBeFocused();
  });

  test('the share button copies a link containing the token', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'Only Chromium supports granting clipboard permissions');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.getByTestId('jwt-share').click();

    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toMatch(new RegExp(`/jwt-parser#token=${SAMPLE_JWT}$`));
  });

  test('a shared link updates an open page', async ({ page }) => {
    await page.goto(`/jwt-parser#token=${SHARED_JWT}`);

    await expect(page.getByTestId('jwt-encoded')).toHaveValue(SHARED_JWT);
    await expect(page.getByTestId('jwt-payload')).toHaveValue(/"sub": "abc"/);
  });

  test('a shared link loads the token on a full page load', async ({ page }) => {
    await page.goto('about:blank');
    await page.goto(`/jwt-parser#token=${SHARED_JWT}`);

    await expect(page.getByTestId('jwt-encoded')).toHaveValue(SHARED_JWT);
    await expect(page.getByTestId('jwt-payload')).toHaveValue(/"sub": "abc"/);
  });
});
