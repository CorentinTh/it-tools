import { expect, test } from '@playwright/test';

test.describe('Tool - Text to Unicode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-to-unicode');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Text to Unicode - IT Tools');
  });

  test('Text to unicode conversion', async ({ page }) => {
    await page.getByTestId('text-to-unicode-input').fill('it-tools');
    const unicode = await page.getByTestId('text-to-unicode-output').inputValue();

    expect(unicode).toEqual('&#105;&#116;&#45;&#116;&#111;&#111;&#108;&#115;');
  });

  test('Unicode to text conversion', async ({ page }) => {
    await page.getByTestId('unicode-to-text-input').fill('&#105;&#116;&#45;&#116;&#111;&#111;&#108;&#115;');
    const text = await page.getByTestId('unicode-to-text-output').inputValue();

    expect(text).toEqual('it-tools');
  });
});
