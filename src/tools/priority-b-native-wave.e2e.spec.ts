import { expect, test } from '@playwright/test';

test.use({ serviceWorkers: 'block' });

test.describe('Priority B browser-native feature wave', () => {
  test('generates an ephemeral secure passphrase', async ({ page }) => {
    await page.goto('/passphrase-generator');
    await page.locator('[data-test-id="passphrase-generate"]').click();
    const output = page.locator('[data-test-id="passphrase-output"] textarea');
    await expect(output).toHaveValue(/^\w+(?:-\w+){5}$/u);
    await expect(page.locator('[data-test-id="passphrase-entropy"]')).toContainText('66.00 bits');
    const generated = await output.inputValue();
    expect(await page.evaluate(value => JSON.stringify(localStorage).includes(value), generated)).toBe(false);
  });

  test('converts and warns about IDN labels locally', async ({ page }) => {
    await page.goto('/idn-safety-converter');
    const input = page.getByLabel('Domain name');
    await input.fill('pаypal.example');
    await page.locator('[data-test-id="idn-inspect"]').click();
    await expect(page.locator('[data-test-id="idn-ascii"] input')).toHaveValue(/^xn--/u);
    await expect(page.locator('[data-test-id="idn-warnings"]')).toContainText(/mixes scripts|confusable/u);
  });

  test('converts exact data units and transfer duration', async ({ page }) => {
    await page.goto('/data-units-converter');
    await expect(page.locator('[data-test-id="data-unit-result"] input')).toHaveValue('0.931322574615478515625');
    await expect(page.locator('[data-test-id="transfer-seconds"] input')).toHaveValue('80 seconds');
  });

  test('inspects IEEE-754 bytes and exact rounding', async ({ page }) => {
    await page.goto('/ieee754-inspector');
    await page.getByLabel('Format').click();
    await page.getByText('binary32 / float', { exact: true }).click();
    await page.locator('[data-test-id="float-inspect"]').click();
    await expect(page.locator('[data-test-id="float-fields"]')).toContainText('3d cc cc cd');
    await expect(page.locator('[data-test-id="float-exact"] textarea')).toHaveValue('0.100000001490116119384765625');
  });

  test('compresses text through browser-native GZIP streams', async ({ page }) => {
    await page.goto('/gzip-converter');
    await page.locator('[data-test-id="gzip-run"]').click();
    await expect(page.locator('[data-test-id="gzip-base64-output"] textarea')).toHaveValue(/^H4sI/u);
    await expect(page.locator('[data-test-id="gzip-download"]')).toBeEnabled();
  });

  test('generates a Markdown table in the bounded worker', async ({ page }) => {
    await page.goto('/markdown-table-generator');
    await page.locator('[data-test-id="markdown-table-generate"]').click();
    await expect(page.getByRole('status')).toContainText('Completed');
    await expect(page.locator('[data-test-id="markdown-table-error"]')).toHaveCount(0);
    await expect(page.locator('[data-test-id="markdown-table-output"]')).toHaveValue(/\| Name \| Language \| Stars \|/u);
  });

  test('authors a Conventional Commit without running Git', async ({ page }) => {
    await page.goto('/conventional-commit-helper');
    await page.locator('[data-test-id="commit-build"]').click();
    await expect(page.locator('[data-test-id="commit-output"] textarea')).toHaveValue('feat(auth): add passkey login');
  });
});
