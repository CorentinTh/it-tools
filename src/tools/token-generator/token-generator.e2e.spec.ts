import { expect, test } from '@playwright/test';

test.describe('Tool - Token generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/token-generator');
  });

  test('Has title', async ({ page }) => {
    await expect(page).toHaveTitle('Token generator - IT Tools');
  });

  test('New token on Generate', async ({ page }) => {
    const initialToken = await page.getByTestId('token-output').inputValue();
    await page.getByRole('button', { name: 'Generate' }).click();
    const newToken = await page.getByTestId('token-output').inputValue();

    expect(newToken).not.toEqual(initialToken);
  });

  test('does not persist generated tokens', async ({ page }) => {
    const token = await page.getByTestId('token-output').inputValue();
    const persistedValues = await page.evaluate(() => Object.values(localStorage));

    expect(persistedValues.every(value => !value.includes(token))).toBe(true);
  });

  test('bounds tampered harmless preferences and keeps custom/denied content ephemeral', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('token-generator:v1:length', '1000000000');
      localStorage.setItem('token-generator:v1:quantity', '1000000000');
    });
    await page.reload();
    await expect(page.getByTestId('token-output')).toHaveValue(/^(?:.{512}\n){99}.{512}$/);
    await page.getByLabel('Custom alphabet (optional)').fill('privateABC');
    await page.getByLabel('Denied characters').fill('private');
    await page.getByTestId('token-generate').click();
    const persistedValues = await page.evaluate(() => Object.values(localStorage).join('\n'));
    expect(persistedValues).not.toContain('privateABC');
  });
});
