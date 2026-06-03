import { expect, test } from '@playwright/test';

test.describe('Tool - National ID generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/national-id-generator');
  });

  test('Has correct title', async ({ page }) => {
    await expect(page).toHaveTitle('NationalID generator - IT Tools');
  });

  test('Clicking Generate produces a visible formatted SSIN', async ({ page }) => {
    await page.getByRole('button', { name: 'Generate' }).click();
    // Formatted SSIN matches pattern XX.XX.XX-XXX.XX
    const formattedInput = page.locator('input[readonly]').first();
    await expect(formattedInput).toHaveValue(/^\d{2}\.\d{2}\.\d{2}-\d{3}\.\d{2}$/);
  });

  test('Enabling Fictitious and clicking Generate produces a SSIN with serial >= 900', async ({ page }) => {
    // Enable fictitious toggle
    await page.locator('.n-switch').click();
    // Select female so serial >= 900
    await page.getByText('— Random —').click();
    await page.getByText('Female').click();

    await page.getByRole('button', { name: 'Generate' }).click();

    const rawInput = page.locator('input[readonly]').nth(1);
    const raw = await rawInput.inputValue();
    const serial = Number(raw.slice(6, 9));
    expect(serial).toBeGreaterThanOrEqual(900);
  });
});
