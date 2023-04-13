import { test, expect } from '@playwright/test';

test.describe('Tool - Json diff', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-diff');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('JSON diff - IT Tools');
  });

  test('Compare two identical JSONs with corresponding result message', async ({ page }) => {
    const json = '{"foo":"bar","list":["item",{"key":"value"}]}';
    await page.getByTestId('leftJson').fill(json);
    await page.getByTestId('rightJson').fill(json);

    const generatedResult = await page.getByTestId('result').innerText();

    expect(generatedResult.trim()).toContain('both JSONs are identical');
  });

  test('Compare two different JSONs with corresponding result message', async ({ page }) => {
    await page.getByTestId('leftJson').fill('{"foo":"bar","list":["item","item2",{"key":"value"}]}');
    await page.getByTestId('rightJson').fill('{"foo":"bar","list":["item",{"key":"value"}]}');

    await expect(page.getByTestId('result').getByRole('listitem')).toHaveCount(6);
  });
});
