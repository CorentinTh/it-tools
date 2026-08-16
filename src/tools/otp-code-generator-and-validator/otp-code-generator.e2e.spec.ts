import { expect, test } from '@playwright/test';

test.describe('Tool - OTP code generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      Date.now = () => 1609477200000; // Jan 1, 2021
    });
    await page.goto('/otp-generator');
    await expect(page).toHaveTitle('OTP code generator - IT Tools');
  });

  test('Has title', async ({ page }) => {
    await expect(page).toHaveTitle('OTP code generator - IT Tools');
  });

  test('Secret hexa value is computed from provided secret', async ({ page }) => {
    await page.getByLabel('RFC 4648 Base32 secret').fill('ITTOOLS');

    const secretInHex = await page.getByLabel('Secret in hexadecimal').inputValue();

    expect(secretInHex).toEqual('44e6e72e02');
  });

  test('OTP a generated from the provided secret', async ({ page }) => {
    await page.getByLabel('RFC 4648 Base32 secret').fill('ITTOOLS');

    const previousOtp = await page.getByTestId('previous-otp').innerText();
    const currentOtp = await page.getByTestId('current-otp').innerText();
    const nextOtp = await page.getByTestId('next-otp').innerText();

    expect(previousOtp.trim()).toEqual('028034');
    expect(currentOtp.trim()).toEqual('162195');
    expect(nextOtp.trim()).toEqual('452815');
  });

  test('You can generate a new random secret', async ({ page }) => {
    const secretInput = page.getByLabel('RFC 4648 Base32 secret');
    const initialSecret = await secretInput.inputValue();
    await page.getByRole('button', { name: 'Generate a new random secret' }).click();

    await expect(secretInput).not.toHaveValue(initialSecret);
    const newSecret = await secretInput.inputValue();

    const persistedValues = await page.evaluate(() => Object.values(localStorage));
    expect(persistedValues.every(value => !value.includes(newSecret))).toBe(true);
  });
});
