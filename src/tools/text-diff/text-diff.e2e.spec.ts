import { expect, test } from '@playwright/test';

const PREFERENCE_KEY = 'it-tools:v1:preferences:text-diff:persist';
const CONTENT_KEY = 'it-tools:v1:content:text-diff';
const LEGACY_KEYS = ['text-diff:original', 'text-diff:modified'];

test.describe('Tool - Text Diff', () => {
  test('keeps content ephemeral by default and clears only on explicit action', async ({ page }) => {
    await page.addInitScript(({ legacyKeys }) => {
      for (const key of legacyKeys) {
        localStorage.setItem(key, 'legacy private content');
      }
    }, { legacyKeys: LEGACY_KEYS });

    await page.goto('/text-diff');

    await expect(page).toHaveTitle('Text diff - IT Tools');
    expect(await page.evaluate(key => localStorage.getItem(key), CONTENT_KEY)).toBeNull();
    expect(await page.evaluate(key => localStorage.getItem(key), PREFERENCE_KEY)).toBeNull();

    await page.getByRole('switch').click();
    await expect.poll(() => page.evaluate(key => localStorage.getItem(key), CONTENT_KEY)).not.toBeNull();

    const storedContent = await page.evaluate(key => localStorage.getItem(key), CONTENT_KEY);
    expect(JSON.parse(storedContent ?? '{}')).toEqual({
      version: 2,
      original: 'original text',
      modified: 'modified text',
    });

    await page.getByRole('button', { name: 'Clear saved text' }).click();
    const remainingKeys = await page.evaluate(() => Object.keys(localStorage));

    expect(remainingKeys).not.toContain(PREFERENCE_KEY);
    expect(remainingKeys).not.toContain(CONTENT_KEY);
    expect(LEGACY_KEYS.every(key => !remainingKeys.includes(key))).toBe(true);
  });

  test('keeps the editor visible when storage rejects opt-in', async ({ page }) => {
    await page.goto('/text-diff');
    await page.evaluate(() => {
      Storage.prototype.setItem = () => {
        throw new DOMException('Storage quota denied', 'QuotaExceededError');
      };
    });

    await page.getByRole('switch').click();

    await expect(page.getByRole('status')).toContainText('Storage quota denied');
    await expect(page.locator('.monaco-diff-editor')).toBeVisible();
  });
});
