import { test, expect } from '@playwright/test';

test.describe('Tool - Argon2 hash generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/argon2-hash-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Argon2 hash generator - IT Tools');
  });

  test('hash a string a verify that the result match', async ({ page }) => {
    await page.getByTestId('input').fill('azerty');

    await new Promise((resolve) => setTimeout(resolve, 500));
    const hash = await page.getByTestId('hash').inputValue();

    await page.getByTestId('compare-string').fill('azerty');
    await page.getByTestId('compare-hash').fill(hash);

    await new Promise((resolve) => setTimeout(resolve, 500));
    const doTheyMatch = await page.getByTestId('do-they-match').innerText();

    expect(doTheyMatch.trim()).toEqual('Yes');
  });

  test('hash a string a verify that the does not result match another string', async ({ page }) => {
    await page.getByTestId('input').fill('azerty');
    const hash = await page.getByTestId('hash').inputValue();

    await page.getByTestId('compare-string').fill('NOT AZERTY');
    await page.getByTestId('compare-hash').fill(hash);
    const doTheyMatch = await page.getByTestId('do-they-match').innerText();

    expect(doTheyMatch.trim()).toEqual('No');
  });
});
