import { expect, test } from '@playwright/test';

test.describe('Tool - JSON diff', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/json-diff');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('JSON diff - IT Tools');
  });

  test('Identical JSONs have a custom result message', async ({ page }) => {
    await page.getByTestId('leftJson').fill('{"foo":"bar"}');
    await page.getByTestId('rightJson').fill('{   "foo":  "bar" }  ');

    const result = await page.getByTestId('diff-result').innerText();

    expect(result).toContain('The provided JSONs are the same');
  });

  test('Different JSONs have differences listed', async ({ page }) => {
    await page.getByTestId('leftJson').fill('{"foo":"bar"}');
    await page.getByTestId('rightJson').fill('{"foo":"buz","baz":"qux"}');

    const result = await page.getByTestId('diff-result').innerText();

    expect(result).toContain('{\nfoo: "bar""buz",\nbaz: "qux",\n},');
  });

  test('Different JSONs have only differences listed when "Only show differences" is checked', async ({ page }) => {
    await page.getByTestId('leftJson').fill('{"foo":"bar"}');
    await page.getByTestId('rightJson').fill('{"foo":"bar","baz":"qux"}');
    await page.getByRole('switch').click();

    const result = await page.getByTestId('diff-result').innerText();

    expect(result).toContain('{\nbaz: "qux",\n},');
  });
});
