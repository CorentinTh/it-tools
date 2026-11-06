import { expect, test } from '@playwright/test';

test.describe('Tool - OTP code generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Date.now = () => 1609477200000; // Jan 1, 2021
    });
    await page.goto('/otp-generator');
  });

  test('Has title', async ({ page }) => {
    await expect(page).toHaveTitle('OTP code generator - IT Tools');
  });

  test('Secret hexa value is computed from provided secret', async ({ page }) => {
    await page.getByPlaceholder('Paste your TOTP secret...').fill('ITTOOLS');

    const secretInHex = await page.getByPlaceholder('Secret in hex will be displayed here').inputValue();

    expect(secretInHex).toEqual('44e6e72e02');
  });

  test('OTP a generated from the provided secret', async ({ page }) => {
    await page.getByPlaceholder('Paste your TOTP secret...').fill('ITTOOLS');

    const previousOtp = await page.getByTestId('previous-otp').innerText();
    const currentOtp = await page.getByTestId('current-otp').innerText();
    const nextOtp = await page.getByTestId('next-otp').innerText();

    expect(previousOtp.trim()).toEqual('028034');
    expect(currentOtp.trim()).toEqual('162195');
    expect(nextOtp.trim()).toEqual('452815');
  });

  test('You can generate a new random secret', async ({ page }) => {
    const initialSecret = await page.getByPlaceholder('Paste your TOTP secret...').inputValue();
    await page
      .locator('div')
      .filter({ hasText: /^Secret$/ })
      .getByRole('button')
      .click();

    const newSecret = await page.getByPlaceholder('Paste your TOTP secret...').inputValue();

    expect(newSecret).not.toEqual(initialSecret);
  });
});
