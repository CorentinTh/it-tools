import { expect, test } from '@playwright/test';

test.describe('Tool - Percentage calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/percentage-calculator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Percentage calculator - IT Tools');
  });

  test('Correctly works out percentages', async ({ page }) => {
    await page.getByTestId('percentageX').locator('input').fill('123');
    await page.getByTestId('percentageY').locator('input').fill('456');
    await expect(page.getByTestId('percentageResult').locator('input')).toHaveValue('560.88');

    await page.getByTestId('numberX').locator('input').fill('123');
    await page.getByTestId('numberY').locator('input').fill('456');
    await expect(page.getByTestId('numberResult').locator('input')).toHaveValue('26.973684210526315');

    await page.getByTestId('numberFrom').locator('input').fill('123');
    await page.getByTestId('numberTo').locator('input').fill('456');
    await expect(page.getByTestId('percentageIncreaseDecrease').locator('input')).toHaveValue('270.7317073170732');
  });

  test('Displays empty results for incomplete input', async ({ page }) => {
    await page.getByTestId('percentageX').locator('input').fill('123');
    await expect(page.getByTestId('percentageResult').locator('input')).toHaveValue('');

    await page.getByTestId('numberY').locator('input').fill('456');
    await expect(page.getByTestId('numberResult').locator('input')).toHaveValue('');

    await page.getByTestId('numberFrom').locator('input').fill('123');
    await expect(page.getByTestId('percentageIncreaseDecrease').locator('input')).toHaveValue('');
  });
});
