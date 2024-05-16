import { expect, test } from '@playwright/test';

test.describe('Tool - Unicode to Java entities', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/unicode-to-java-entites');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Unicode to Java Entities - IT Tools');
  });

  test('Unicode to Entities conversion', async ({ page }) => {
    await page.getByTestId('unicode-to-entities-input').fill('việt nam');
    const unicode = await page.getByTestId('unicode-to-entities-output').inputValue();

    expect(unicode).toEqual('vi\u1EC7t nam');
  });

  test('Entities to Unicode conversion', async ({ page }) => {
    await page.getByTestId('entities-to-unicode-input').fill('vi\u1EC7t nam');
    const text = await page.getByTestId('entities-to-unicode-output').inputValue();

    expect(text).toEqual('việt nam');
  });
});
