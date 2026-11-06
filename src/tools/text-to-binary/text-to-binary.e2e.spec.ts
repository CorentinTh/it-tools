import { expect, test } from '@playwright/test';

test.describe('Tool - Text to ASCII binary', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/text-to-binary');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Text to ASCII binary - IT Tools');
  });

  test('Text to binary conversion', async ({ page }) => {
    await page.getByTestId('text-to-binary-input').fill('it-tools');
    const binary = await page.getByTestId('text-to-binary-output').inputValue();

    expect(binary).toEqual('01101001 01110100 00101101 01110100 01101111 01101111 01101100 01110011');
  });

  test('Binary to text conversion', async ({ page }) => {
    await page.getByTestId('binary-to-text-input').fill('01101001 01110100 00101101 01110100 01101111 01101111 01101100 01110011');
    const text = await page.getByTestId('binary-to-text-output').inputValue();

    expect(text).toEqual('it-tools');
  });
});
