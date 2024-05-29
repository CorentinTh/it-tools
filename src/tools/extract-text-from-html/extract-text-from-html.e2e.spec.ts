import { expect, test } from '@playwright/test';

test.describe('Tool - Extract text from html', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/extract-text-from-html');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Extract text from HTML - IT Tools');
  });

  test('Extract text from HTML', async ({ page }) => {
    await page.getByTestId('input').fill('<p>Paste your HTML in the input form on the left</p>');
    const extractedText = await page.getByTestId('area-content').innerText();
    expect(extractedText.trim()).toEqual('Paste your HTML in the input form on the left'.trim());
  });
});
