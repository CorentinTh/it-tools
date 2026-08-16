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

  test('selects a local JWKS key by kid and verifies RS256 without a network lookup', async ({ page }) => {
    await page.goto('/jwt-parser');
    const fixture = await page.evaluate(async () => {
      const pair = await crypto.subtle.generateKey({
        hash: 'SHA-256',
        modulusLength: 2048,
        name: 'RSASSA-PKCS1-v1_5',
        publicExponent: new Uint8Array([1, 0, 1]),
      }, true, ['sign', 'verify']);
      if (!('publicKey' in pair)) {
        throw new Error('Expected an RSA key pair.');
      }
      const encode = (value: object) => {
        const bytes = new TextEncoder().encode(JSON.stringify(value));
        let binary = '';
        bytes.forEach((byte) => {
          binary += String.fromCharCode(byte);
        });
        return btoa(binary).replace(/=/gu, '').replace(/\+/gu, '-').replace(/\//gu, '_');
      };
      const signingInput = `${encode({ alg: 'RS256', kid: 'browser-current', typ: 'JWT' })}.${encode({ sub: 'browser-rsa' })}`;
      const signature = new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', pair.privateKey, new TextEncoder().encode(signingInput)));
      let signatureBinary = '';
      signature.forEach((byte) => {
        signatureBinary += String.fromCharCode(byte);
      });
      const encodedSignature = btoa(signatureBinary).replace(/=/gu, '').replace(/\+/gu, '-').replace(/\//gu, '_');
      const publicJwk = await crypto.subtle.exportKey('jwk', pair.publicKey);
      return {
        jwks: JSON.stringify({ keys: [{ ...publicJwk, alg: 'RS256', kid: 'browser-current', use: 'sig' }] }),
        token: `${signingInput}.${encodedSignature}`,
      };
    });

    await page.getByLabel('Operation', { exact: true }).click();
    await page.getByRole('option', { name: 'Verify with JWK / JWKS / public PEM', exact: true }).click();
    await page.getByTestId('jwt-token-input').locator('textarea').fill(fixture.token);
    await page.getByTestId('jwt-public-key').locator('textarea').fill(fixture.jwks);
    await page.getByTestId('jwt-run').click();
    await expect(page.getByTestId('jwt-status')).toContainText('RS256 signature is valid');
    await expect(page.getByTestId('jwt-status')).toContainText('kid "browser-current"');
    expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('browser-current');
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
