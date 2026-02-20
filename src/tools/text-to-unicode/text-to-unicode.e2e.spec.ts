import { expect, test } from '@playwright/test';

test.describe('Tool - Text to Unicode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-to-unicode');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Text to Unicode - IT Tools');
  });

  test('Text to unicode conversion', async ({ page }) => {
    await page.getByTestId('text-to-unicode-input').fill('"it-tools" 文字');
    const unicode = await page.getByTestId('text-to-unicode-output').inputValue();

    // eslint-disable-next-line unicorn/escape-case
    expect(unicode).toEqual(String.raw`\u0022it-tools\u0022 \u6587\u5b57`);
  });

  test('Unicode to text conversion', async ({ page }) => {
    // eslint-disable-next-line unicorn/escape-case
    await page.getByTestId('unicode-to-text-input').fill(String.raw`\u0022it-tools\u0022 \u6587\u5b57`);
    const text = await page.getByTestId('unicode-to-text-output').inputValue();

    expect(text).toEqual('"it-tools" 文字');
  });
});
