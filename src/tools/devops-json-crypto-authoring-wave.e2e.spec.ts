import { expect, test } from '@playwright/test';

test.describe('DevOps, JSON, crypto, and token authoring wave', () => {
  test('exports a selected JSON subtree as deterministic shell-safe env assignments', async ({ page }) => {
    await page.goto('/devops-config-workspace');
    await page.getByText('JSON/YAML/TOML → .env', { exact: true }).click();
    await page.getByRole('combobox', { name: 'Input format' }).click();
    await page.getByRole('option', { name: 'JSON', exact: true }).click();
    await page.getByLabel('Root JSON Pointer').fill('/service');
    await page.getByLabel('Variable prefix').fill('APP');
    await page.getByTestId('devops-config-input').fill('{"service":{"host":"localhost","password":"it\'s local"},"ignored":true}');
    await page.getByTestId('devops-config-run').click();
    await expect(page.getByTestId('devops-config-output')).toHaveValue(/APP_HOST='localhost'/);
    await expect(page.getByTestId('devops-config-output')).toHaveValue(/APP_PASSWORD='it'\\''s local'/);
  });

  test('generates an RFC 6902 patch with escaped JSON Pointer paths and preserved integer text', async ({ page }) => {
    await page.goto('/json-code-generator');
    await page.getByText('RFC 6902 JSON Patch', { exact: true }).click();
    await page.getByTestId('json-code-input').fill('{"a/b":1,"gone":true,"items":[1,2],"big":9007199254740993}');
    await page.getByTestId('json-code-comparison').fill('{"a/b":2,"items":[1,3,4],"big":9007199254740994}');
    await page.getByTestId('json-code-run').click();
    await expect(page.getByTestId('json-code-output')).toHaveValue(/"path": "\/a~1b"/);
    await expect(page.getByTestId('json-code-output')).toHaveValue(/9007199254740994/);
  });

  test('computes the RFC 4231 HMAC-SHA-256 vector from an explicit hex key in a worker', async ({ page }) => {
    await page.goto('/hmac-generator');
    await page.getByTestId('hmac-message').fill('Hi There');
    await page.getByRole('combobox', { name: 'Key representation' }).click();
    await page.getByRole('option', { name: 'HEX', exact: true }).click();
    await page.getByTestId('hmac-key').fill('0b'.repeat(20));
    await page.getByTestId('hmac-run').click();
    await expect(page.getByTestId('hmac-output')).toHaveValue('b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7');
  });

  test('generates a bounded custom batch without persisting custom or denied characters', async ({ page }) => {
    await page.goto('/token-generator');
    await page.getByTestId('token-length').locator('input').fill('8');
    await page.getByTestId('token-quantity').locator('input').fill('3');
    await page.getByLabel('Custom alphabet (optional)').fill('privateABC');
    await page.getByLabel('Denied characters').fill('private');
    await page.getByTestId('token-generate').click();
    const tokens = (await page.getByTestId('token-output').inputValue()).split('\n');
    expect(tokens).toHaveLength(3);
    expect(tokens.every(token => token.length === 8 && /^[ABC]+$/.test(token))).toBe(true);
    const persisted = await page.evaluate(() => Object.values(localStorage).join('\n'));
    expect(persisted).not.toContain('privateABC');
  });
});
