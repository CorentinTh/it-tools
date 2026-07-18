import { expect, test } from '@playwright/test';

test.describe('Tool - Token generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/token-generator');
  });

  test('Has title', async ({ page }) => {
    await expect(page).toHaveTitle('Token generator - IT Tools');
  });

  test('New token on refresh', async ({ page }) => {
    const initialToken = await page.getByPlaceholder('The token...').inputValue();
    await page.getByRole('button', { name: 'Refresh' }).click();
    const newToken = await page.getByPlaceholder('The token...').inputValue();

    expect(newToken).not.toEqual(initialToken);
  });

  test('does not persist generated tokens', async ({ page }) => {
    const token = await page.getByPlaceholder('The token...').inputValue();
    const persistedValues = await page.evaluate(() => Object.values(localStorage));

    expect(persistedValues.every(value => !value.includes(token))).toBe(true);
  });

  test('bounds an untrusted length query parameter', async ({ page }) => {
    await page.goto('/token-generator?length=1000000000');

    await expect(page.getByPlaceholder('The token...')).toHaveValue(/^.{512}$/);
  });
});
