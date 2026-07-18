import { type Page, expect, test } from '@playwright/test';

const LEGACY_SENSITIVE_CONTENT_STORAGE_KEYS = [
  'json-prettify:raw-json',
  'yaml-prettify:raw-yaml',
  'json-diff:raw-left-json',
  'json-diff:raw-right-json',
  'html-wysiwyg-editor--html',
  'benchmark-builder:suites',
  'case-converter:input',
  'regex-tester:regex',
  'ipv4-converter:ip',
  'ipv4-range-expander:startAddress',
  'ipv4-range-expander:endAddress',
  'ipv4-subnet-calculator:ip',
  'mac-address-generator-prefix',
] as const;

async function expectStorageKeyAbsent(page: Page, key: string) {
  await expect.poll(() => page.evaluate(storageKey => localStorage.getItem(storageKey), key)).toBeNull();
}

test.describe('sensitive tool content persistence', () => {
  test('cleans legacy content on startup without deleting harmless preferences', async ({ page }) => {
    await page.addInitScript(({ contentKeys }) => {
      for (const key of contentKeys) {
        localStorage.setItem(key, `private:${key}`);
      }

      localStorage.setItem('json-prettify:indent-size', '4');
      localStorage.setItem('json-prettify:sort-keys', 'true');
      localStorage.setItem('benchmark-builder:unit', 'ms');
    }, { contentKeys: [...LEGACY_SENSITIVE_CONTENT_STORAGE_KEYS] });

    await page.goto('/json-prettify');

    for (const key of LEGACY_SENSITIVE_CONTENT_STORAGE_KEYS) {
      await expectStorageKeyAbsent(page, key);
    }
    expect(await page.evaluate(() => localStorage.getItem('json-prettify:indent-size'))).toBe('4');
    expect(await page.evaluate(() => localStorage.getItem('json-prettify:sort-keys'))).toBe('true');
    expect(await page.evaluate(() => localStorage.getItem('benchmark-builder:unit'))).toBe('ms');
  });

  test('does not write edited raw content for the migrated tools', async ({ page }) => {
    await page.goto('/json-prettify');
    await page.getByPlaceholder('Paste your raw JSON here...').fill('{"token":"private-json"}');
    await expectStorageKeyAbsent(page, 'json-prettify:raw-json');

    await page.goto('/yaml-prettify');
    await page.getByPlaceholder('Paste your raw YAML here...').fill('token: private-yaml');
    await expectStorageKeyAbsent(page, 'yaml-prettify:raw-yaml');

    await page.goto('/json-diff');
    await page.getByTestId('leftJson').fill('{"token":"private-left"}');
    await page.getByTestId('rightJson').fill('{"token":"private-right"}');
    await expectStorageKeyAbsent(page, 'json-diff:raw-left-json');
    await expectStorageKeyAbsent(page, 'json-diff:raw-right-json');

    await page.goto('/html-wysiwyg-editor');
    await page.locator('.ProseMirror').fill('private html draft');
    await expectStorageKeyAbsent(page, 'html-wysiwyg-editor--html');

    await page.goto('/benchmark-builder');
    await page.getByPlaceholder('Suite name...').first().fill('private benchmark');
    await expectStorageKeyAbsent(page, 'benchmark-builder:suites');

    await page.goto('/case-converter');
    await page.getByPlaceholder('Your string...').fill('private case input');
    await expectStorageKeyAbsent(page, 'case-converter:input');

    await page.goto('/regex-tester');
    await page.getByPlaceholder('Put the regex to test').fill('private-(?<token>.+)');
    await expectStorageKeyAbsent(page, 'regex-tester:regex');

    await page.goto('/ipv4-address-converter');
    await page.getByPlaceholder('The ipv4 address...').fill('10.75.22.9');
    await expectStorageKeyAbsent(page, 'ipv4-converter:ip');

    await page.goto('/ipv4-range-expander');
    await page.getByPlaceholder('Start IPv4 address...').fill('10.75.22.1');
    await page.getByPlaceholder('End IPv4 address...').fill('10.75.22.254');
    await expectStorageKeyAbsent(page, 'ipv4-range-expander:startAddress');
    await expectStorageKeyAbsent(page, 'ipv4-range-expander:endAddress');

    await page.goto('/ipv4-subnet-calculator');
    await page.getByPlaceholder('The ipv4 address...').fill('10.75.22.9/24');
    await expectStorageKeyAbsent(page, 'ipv4-subnet-calculator:ip');

    await page.goto('/mac-address-generator');
    await page.getByPlaceholder('Set a prefix, e.g. 64:16:7F').fill('AA:BB:CC');
    await expectStorageKeyAbsent(page, 'mac-address-generator-prefix');
  });
});
