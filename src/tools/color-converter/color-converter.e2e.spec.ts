import { expect, test } from '@playwright/test';

test.describe('Tool - Color converter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/color-converter');
  });

  test('Has title', async ({ page }) => {
    await expect(page).toHaveTitle('Color converter - IT Tools');
  });

  test('Color is converted from its name to other formats', async ({ page }) => {
    await page.getByTestId('input-name').fill('olive');

    expect(await page.getByTestId('input-name').inputValue()).toEqual('olive');
    expect(await page.getByTestId('input-hex').inputValue()).toEqual('#808000');
    expect(await page.getByTestId('input-rgb').inputValue()).toEqual('rgb(128, 128, 0)');
    expect(await page.getByTestId('input-hsl').inputValue()).toEqual('hsl(60, 100%, 25%)');
    expect(await page.getByTestId('input-hwb').inputValue()).toEqual('hwb(60 0% 50%)');
    expect(await page.getByTestId('input-cmyk').inputValue()).toEqual('device-cmyk(0% 0% 100% 50%)');
    expect(await page.getByTestId('input-lch').inputValue()).toEqual('lch(52.15% 56.81 99.57)');
  });
});
