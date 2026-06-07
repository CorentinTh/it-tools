import { expect, test } from '@playwright/test';

test.describe('Tool - Tip calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tip-calculator');
    await page.locator('[data-test-id="billAmount"]').waitFor();
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Tip calculator - IT Tools');
  });

  test('Correctly calculates tip and split', async ({ page }) => {
    // Fill bill amount
    await page.getByTestId('billAmount').locator('input').fill('100');

    // Fill tip percentage
    await page.getByTestId('tipPercentage').locator('input').fill('15');

    // Fill number of people
    await page.getByTestId('numberOfPeople').locator('input').fill('2');

    // Check results
    // 100 * 0.15 = 15.00
    await expect(page.getByTestId('tipAmountResult').locator('input')).toHaveValue('15.00');

    // 100 + 15 = 115.00
    await expect(page.getByTestId('totalBillResult').locator('input')).toHaveValue('115.00');

    // 115 / 2 = 57.50
    await expect(page.getByTestId('amountPerPersonResult').locator('input')).toHaveValue('57.50');
  });

  test('Quick tip buttons work', async ({ page }) => {
    await page.getByTestId('billAmount').locator('input').fill('100');

    // Click 20% button
    await page.getByRole('button', { name: '20%' }).click();

    await expect(page.getByTestId('tipPercentage').locator('input')).toHaveValue('20');
    await expect(page.getByTestId('tipAmountResult').locator('input')).toHaveValue('20.00');
  });

  test('Displays initial/empty results correctly', async ({ page }) => {
    // Initial state with empty bill
    await expect(page.getByTestId('tipAmountResult').locator('input')).toHaveValue('0.00');
    await expect(page.getByTestId('totalBillResult').locator('input')).toHaveValue('0.00');
    await expect(page.getByTestId('amountPerPersonResult').locator('input')).toHaveValue('0.00');
  });
});
