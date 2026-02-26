import { expect, test } from '@playwright/test';

test.describe('Tool - Text to Unicode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-to-unicode');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Text to Unicode - IT Tools');
  });

  test('Text to unicode conversion (HTML decimal)', async ({ page }) => {
    await page.getByTestId('text-to-unicode-input').fill('it-tools');
    const unicode = await page.getByTestId('text-to-unicode-output').inputValue();

    expect(unicode).toEqual('&#105;&#116;&#45;&#116;&#111;&#111;&#108;&#115;');
  });

  test('Text to unicode conversion (\\u hex)', async ({ page }) => {
    await page.getByTestId('text-to-unicode-input').fill('it-tools');
    const unicodeHex = await page.getByTestId('text-to-unicode-output-hex').inputValue();

    expect(unicodeHex).toEqual('\\u0069\\u0074\\u002d\\u0074\\u006f\\u006f\\u006c\\u0073');
  });

  test('Unicode to text conversion (&#xxx;)', async ({ page }) => {
    await page.getByTestId('unicode-to-text-input').fill('&#105;&#116;&#45;&#116;&#111;&#111;&#108;&#115;');
    const text = await page.getByTestId('unicode-to-text-output').inputValue();

    expect(text).toEqual('it-tools');
  });

  test('Unicode to text conversion (\\uxxxx)', async ({ page }) => {
    await page.getByTestId('unicode-to-text-input').fill('\\u0069\\u0074\\u002d\\u0074\\u006f\\u006f\\u006c\\u0073');
    const text = await page.getByTestId('unicode-to-text-output').inputValue();

    expect(text).toEqual('it-tools');
  });
});
