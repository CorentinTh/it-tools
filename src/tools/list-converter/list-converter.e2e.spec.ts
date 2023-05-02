import { test, expect } from '@playwright/test';

test.describe('Tool - List converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/list-converter');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('List converter - IT Tools');
  });

  test('Simple list should be converted with default settings', async ({ page }) => {
    await page.getByTestId('input').fill(`1
    2
    3
    4
    5`);

    const result = await page.getByTestId('area-content').innerText();

    expect(result.trim()).toEqual('1, 2, 3, 4, 5');
  });

  test('Duplicates should be removed, list should be sorted and prefix and suffix list items', async ({ page }) => {
    await page.getByTestId('input').fill(`1
    2
    2
    4
    4
    3
    5`);
    await page.getByTestId('removeDuplicates').check();
    await page.getByTestId('reverseList').check();
    await page.getByTestId('itemPrefix').locator('input').fill("'");
    await page.getByTestId('itemSuffix').locator('input').fill("'");

    const result = await page.getByTestId('area-content').innerText();
    expect(result.trim()).toEqual("'5', '3', '4', '2', '1'");
  });
});
