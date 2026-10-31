import { expect, test } from '@playwright/test';

test.describe('Tool - Loan calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/loan-calculator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Loan / EMI calculator - IT Tools');
  });

  test('Correctly works out the monthly payment', async ({ page }) => {
    await page.getByTestId('loanAmount').locator('input').fill('100000');
    await page.getByTestId('annualRate').locator('input').fill('12');
    await page.getByTestId('durationMonths').locator('input').fill('12');
    await expect(page.getByTestId('monthlyPayment').locator('input')).toHaveValue('8884.88');
    await expect(page.getByTestId('totalPayment').locator('input')).toHaveValue('106618.56');
    await expect(page.getByTestId('totalInterest').locator('input')).toHaveValue('6618.56');
  });

  test('Displays empty results for incomplete input', async ({ page }) => {
    await page.getByTestId('loanAmount').locator('input').fill('100000');
    await expect(page.getByTestId('monthlyPayment').locator('input')).toHaveValue('');
  });
});
