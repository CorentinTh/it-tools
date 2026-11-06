import { expect, test } from '@playwright/test';

test.describe('Tool - Numeronym generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/numeronym-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Numeronym generator - IT Tools');
  });

  test('a numeronym is generated when a word is entered', async ({ page }) => {
    await page.getByTestId('word-input').fill('internationalization');
    const numeronym = await page.getByTestId('numeronym').inputValue();

    expect(numeronym).toEqual('i18n');
  });

  test('when a word has 3 letters or less, the numeronym is the word itself', async ({ page }) => {
    await page.getByTestId('word-input').fill('abc');
    const numeronym = await page.getByTestId('numeronym').inputValue();

    expect(numeronym).toEqual('abc');
  });
});
