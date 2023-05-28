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
});
